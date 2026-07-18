import React from "react";
import { Link } from "react-router-dom";

/**
 * Auth shell styled to match the Framer landing visual language:
 * - Accent purple rgb(110, 5, 255) / #6E05FF
 * - Near-black text rgb(5, 5, 5)
 * - Inter Tight for headings, Inter for body
 * - Pill CTAs (100px radius) like the landing "Login" / "Request Access" buttons
 * - Soft off-white page background with a subtle violet wash
 *
 * Scoped to auth routes only — does not mutate global SaaS theme tokens.
 */
export function AuthBrandLogo() {
  return (
    <Link to="/" className="inline-flex items-center justify-center" aria-label="Data Furnishing home">
      <img
        src="https://media.base44.com/images/public/69f90686411a7f6520cfe22a/4859ca4a2_MainSignature.png"
        alt="Data Furnishing"
        className="h-7 w-auto"
      />
    </Link>
  );
}

export function AuthShell({ children, maxWidth = "max-w-[420px]" }) {
  return (
    <div className="df-auth-shell min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className={`w-full ${maxWidth}`}>{children}</div>
    </div>
  );
}

export function AuthCard({ children }) {
  return <div className="df-auth-card">{children}</div>;
}

export function AuthTitle({ title, subtitle }) {
  return (
    <div className="mb-8 text-center">
      <h1 className="df-auth-title">{title}</h1>
      {subtitle ? <p className="df-auth-subtitle">{subtitle}</p> : null}
    </div>
  );
}

export function AuthFooterNote({ children }) {
  return <p className="df-auth-footer">{children}</p>;
}

export function AuthCopyright() {
  return (
    <p className="text-center text-[10px] text-black/30 mt-8 tracking-wide">
      © 2026 Data Furnishing Technologies, Inc.
    </p>
  );
}
