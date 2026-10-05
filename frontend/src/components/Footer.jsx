import React from "react";
import { Link } from "react-router-dom";
import { Bridge } from "./Logo";

const linkClass = "hover:text-[var(--sb-purple)]";

export default function Footer() {
  return (
    <footer className="bg-[var(--sb-lavender)]/40 border-t border-[var(--sb-border)] mt-24" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2">
            <Bridge className="w-8 h-8" />
            <span className="text-lg font-extrabold">Sense<span className="text-[var(--sb-purple)]">Bridge</span></span>
          </div>
          <p className="mt-4 text-sm text-[var(--sb-text-soft)] leading-relaxed">
            AI-powered accessibility for a more inclusive tomorrow.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Tools</h4>
          <ul className="space-y-2.5 text-sm text-[var(--sb-text-soft)]">
            <li><Link to="/tools" className={linkClass}>Tools</Link></li>
            <li><Link to="/sound-alerts" className={linkClass}>Sound Alerts</Link></li>
            <li><Link to="/extension" className={linkClass}>Browser Extension</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Project</h4>
          <ul className="space-y-2.5 text-sm text-[var(--sb-text-soft)]">
            <li><Link to="/about" className={linkClass}>About</Link></li>
            <li><Link to="/ai-vision" className={linkClass}>AI Vision</Link></li>
            <li><Link to="/community" className={linkClass}>Community</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--sb-border)] py-5 text-center text-sm text-[var(--sb-text-soft)]">
        © {new Date().getFullYear()} SenseBridge. Released under the MIT License.
      </div>
    </footer>
  );
}
