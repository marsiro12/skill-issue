"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Already installed as PWA
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    // Already dismissed
    if (localStorage.getItem("install-dismissed")) return;

    const ua = navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua);
    const safari = /safari/i.test(ua) && !/crios|fxios|chrome/i.test(ua);
    setIsIos(ios && safari);
    setShow(true);

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    localStorage.setItem("install-dismissed", "1");
    setShow(false);
  }

  async function install() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      setShow(false);
    }
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 animate-fadeUp">
      <div
        className="max-w-sm mx-auto rounded-3xl p-5"
        style={{
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-line)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
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
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-ink-muted)" }}>
              {isIos
                ? <>Teilen <span style={{ color: "var(--color-ink)" }}>↑</span> → „Zum Home-Bildschirm"</>
                : deferredPrompt
                ? "Als App auf dem Startbildschirm speichern"
                : <>Menü <span style={{ color: "var(--color-ink)" }}>⋮</span> → „App installieren"</>}
            </p>
          </div>
          <button
            onClick={dismiss}
            className="text-lg leading-none shrink-0 transition hover:opacity-60 cursor-pointer"
            style={{ color: "var(--color-ink-soft)" }}
          >
            ✕
          </button>
        </div>

        {deferredPrompt && (
          <button
            onClick={install}
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
