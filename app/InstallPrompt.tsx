"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [prompt, setPrompt] = useState<Event & { prompt?: () => Promise<void> } | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Already running as installed PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }

    // iOS detection
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const safari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent);
    if (ios && safari) setIsIos(true);

    // Android/Chrome install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as Event & { prompt?: () => Promise<void> });
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (installed || dismissed) return null;
  if (!prompt && !isIos) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-4 animate-fadeUp"
      style={{ background: "var(--color-bg)" }}
    >
      <div
        className="max-w-sm mx-auto rounded-3xl p-5"
        style={{
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-line)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        }}
      >
        <div className="flex items-start gap-3">
          <span
            className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "var(--gradient-warm)" }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2 L4 14 L11 14 L11 22 L20 10 L13 10 Z" />
            </svg>
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm mb-0.5" style={{ color: "var(--color-ink)" }}>
              Skill Issue installieren
            </p>
            {isIos ? (
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-ink-muted)" }}>
                Tippe auf{" "}
                <span style={{ color: "var(--color-ink)" }}>Teilen</span>
                {" "}→{" "}
                <span style={{ color: "var(--color-ink)" }}>„Zum Home-Bildschirm"</span>
              </p>
            ) : (
              <p className="text-xs" style={{ color: "var(--color-ink-muted)" }}>
                Als App auf dem Startbildschirm speichern
              </p>
            )}
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-lg leading-none shrink-0 transition hover:opacity-60 cursor-pointer"
            style={{ color: "var(--color-ink-soft)" }}
          >
            ✕
          </button>
        </div>

        {!isIos && prompt && (
          <button
            onClick={async () => {
              await (prompt as any).prompt();
              setPrompt(null);
            }}
            className="mt-4 w-full rounded-xl text-white font-medium py-2.5 text-sm transition active:scale-[0.985] cursor-pointer"
            style={{ background: "var(--gradient-warm)" }}
          >
            Installieren
          </button>
        )}
      </div>
    </div>
  );
}
