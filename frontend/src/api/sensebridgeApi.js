import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API, timeout: 60000 });

export const describeImage = (image_base64, follow_up) =>
  api.post("/image-to-speech", { image_base64, follow_up }).then(r => r.data);

export const saveTranscript = (payload) =>
  api.post("/transcripts", payload).then(r => r.data);

export const listCommunity = (category) =>
  api.get("/community", { params: category ? { category } : {} }).then(r => r.data);

export const createPost = (payload) =>
  api.post("/community", payload).then(r => r.data);

export const likePost = (id) =>
  api.post(`/community/${id}/like`).then(r => r.data);

export default api;