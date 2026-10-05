import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AccessibilityToolbar from "./components/AccessibilityToolbar";
import Home from "./pages/Home";
import Tools from "./pages/Tools";
import SoundAlerts from "./pages/SoundAlerts";
import Extension from "./pages/Extension";
import Community from "./pages/Community";
import About from "./pages/About";
import AIVision from "./pages/AIVision";
import { Toaster } from "sonner";

function Layout({ children }) {
  return (
    <div className="App min-h-screen flex flex-col">
      <Navbar />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
      <AccessibilityToolbar />
      <Toaster position="top-right" richColors />
    </div>
  );
}

function App() {
  return (
    <AccessibilityProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/sound-alerts" element={<SoundAlerts />} />
            <Route path="/extension" element={<Extension />} />
            <Route path="/community" element={<Community />} />
            <Route path="/about" element={<About />} />
            <Route path="/ai-vision" element={<AIVision />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AccessibilityProvider>
  );
}

export default App;