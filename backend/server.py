"""SenseBridge FastAPI backend - all routes prefixed with /api"""
import io
import os
import uuid
import base64
import logging
import time
from io import BytesIO
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from PIL import Image
from gtts import gTTS

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# Gemini API Key
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

app = FastAPI(title="SenseBridge API")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sensebridge")


# ============== MODELS ==============
class ImageDescribeRequest(BaseModel):
    image_base64: str
    follow_up: Optional[str] = None
    user_id: Optional[str] = None

class ImageDescribeResponse(BaseModel):
    id: str
    description: str
    created_at: str

class TTSRequest(BaseModel):
    text: str
    language: str = "en"

class TranscriptCreate(BaseModel):
    type: str
    content: str
    language: str = "en"
    user_id: Optional[str] = None

class Transcript(BaseModel):
    id: str
    type: str
    content: str
    language: str
    user_id: Optional[str] = None
    created_at: str

class CommunityPostCreate(BaseModel):
    author_name: str
    title: str
    body: str
    category: str = "story"

class CommunityPost(BaseModel):
    id: str
    author_name: str
    title: str
    body: str
    category: str
    likes: int = 0
    created_at: str


# ============== ROUTES ==============
@api.get("/")
async def root():
    return {"app": "SenseBridge", "tagline": "Your Digital Eyes & Ears", "status": "ok"}

@api.get("/health")
async def health():
    return {"status": "healthy", "llm_configured": bool(GEMINI_API_KEY)}


# ---------- System prompt ----------
SYSTEM_DESCRIBE = (
    "You are the eyes of a blind person. Describe this image warmly and in rich detail. "
    "Start with the most important thing in the scene. Then describe people, their expressions "
    "and emotions, objects, colors, any text visible, and the overall mood and atmosphere. "
    "Speak directly and warmly to the user as if you are their trusted companion. "
    "Keep it under 150 words, conversational, never clinical."
)


# ---------- Image to Speech ----------
@api.post("/image-to-speech", response_model=ImageDescribeResponse)
async def image_to_speech(req: ImageDescribeRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(500, "Gemini API key not configured. Please add GEMINI_API_KEY to your .env file.")
    try:
        from google import genai
        from google.genai import types

        client_genai = genai.Client(api_key=GEMINI_API_KEY)

        # Strip data URL prefix if present
        b64 = req.image_base64
        if "," in b64:
            b64 = b64.split(",", 1)[1]

        # Decode base64 to bytes
        image_bytes = base64.b64decode(b64)

        # Resize image to reduce token usage
        pil_img = Image.open(io.BytesIO(image_bytes))
        pil_img.thumbnail((800, 800))
        buf = io.BytesIO()
        pil_img.save(buf, format="JPEG", quality=85)
        image_bytes = buf.getvalue()

        prompt_text = req.follow_up or "Please describe this image."
        full_prompt = SYSTEM_DESCRIBE + "\n\n" + prompt_text

        # Retry up to 3 times on rate limit
        last_exc = None
        response = None
        for attempt in range(3):
            try:
                response = client_genai.models.generate_content(
                    model="gemini-2.0-flash",
                    contents=[
                        full_prompt,
                        types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
                    ],
                )
                last_exc = None
                break
            except Exception as e:
                last_exc = e
                err_str = str(e)
                if ("429" in err_str or "quota" in err_str.lower() or "exhausted" in err_str.lower()) and attempt < 2:
                    wait = 15 * (attempt + 1)
                    logger.warning(f"Rate limited. Waiting {wait}s before retry {attempt + 2}/3...")
                    time.sleep(wait)
                    continue
                raise

        if last_exc:
            raise last_exc

        description = response.text.strip()
        logger.info("Image described successfully via Gemini API")

    except Exception as e:
        logger.exception("Gemini vision failed")
        raise HTTPException(500, f"Image description failed: {e}")

    rec_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()

    doc = {
        "id": rec_id,
        "type": "image-description",
        "content": description,
        "language": "en",
        "user_id": req.user_id,
        "created_at": now,
    }

    await db.transcripts.insert_one(doc)

    return ImageDescribeResponse(id=rec_id, description=description, created_at=now)


# ---------- Text to Speech ----------
@api.post("/text-to-speech")
async def text_to_speech(req: TTSRequest):
    if not req.text.strip():
        raise HTTPException(400, "Text cannot be empty")
    try:
        tts = gTTS(text=req.text[:4000], lang=req.language or "en")
        buf = BytesIO()
        tts.write_to_fp(buf)
        buf.seek(0)
        return StreamingResponse(buf, media_type="audio/mpeg")
    except Exception as e:
        logger.exception("gTTS failed")
        raise HTTPException(500, f"TTS failed: {e}")


# ---------- Transcripts ----------
@api.post("/transcripts", response_model=Transcript)
async def save_transcript(req: TranscriptCreate):
    rec_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    doc = {"id": rec_id, "type": req.type, "content": req.content,
           "language": req.language, "user_id": req.user_id, "created_at": now}
    await db.transcripts.insert_one(doc)
    return Transcript(**doc)

@api.get("/transcripts", response_model=List[Transcript])
async def list_transcripts(limit: int = 20):
    docs = (
        await db.transcripts.find({}, {"_id": 0})
        .sort("created_at", -1)
        .to_list(limit)
    )
    return [Transcript(**d) for d in docs]


# ---------- Community ----------
@api.post("/community", response_model=CommunityPost)
async def create_post(req: CommunityPostCreate):
    rec_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    doc = {"id": rec_id, "author_name": req.author_name, "title": req.title,
           "body": req.body, "category": req.category, "likes": 0, "created_at": now}
    await db.community_posts.insert_one(doc)
    return CommunityPost(**doc)

@api.get("/community", response_model=List[CommunityPost])
async def list_posts(category: Optional[str] = None, limit: int = 50):
    q = {"category": category} if category else {}
    docs = (
        await db.community_posts.find(q, {"_id": 0})
        .sort("created_at", -1)
        .to_list(limit)
    )
    return [CommunityPost(**d) for d in docs]

@api.post("/community/{post_id}/like")
async def like_post(post_id: str):
    res = await db.community_posts.find_one_and_update(
        {"id": post_id}, {"$inc": {"likes": 1}},
        projection={"_id": 0}, return_document=True,
    )
    if not res:
        raise HTTPException(404, "Post not found")
    return res

app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown():
    client.close()
