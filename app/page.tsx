import Link from "next/link";

export default function Home() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="max-w-md text-center animate-fadeUp">
        <div className="inline-flex items-center gap-3 mb-10">
          <span
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--gradient-warm)" }}
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2 L4 14 L11 14 L11 22 L20 10 L13 10 Z" />
            </svg>
          </span>
          <span
            className="text-2xl font-medium tracking-tight"
            style={{ color: "var(--color-ink)" }}
          >
            Skill Issue
          </span>
        </div>

        <h1
          className="text-4xl sm:text-5xl font-medium tracking-tight mb-5 leading-[1.05]"
          style={{ color: "var(--color-ink)" }}
        >
          Lern Skills. <br />
          Halt dich accountable.
        </h1>

        <p
          className="text-base mb-10 max-w-sm mx-auto"
          style={{ color: "var(--color-ink-muted)" }}
        >
          Setz dir konkrete Ziele mit Deadline, sammle Punkte, und zieh deinen Kumpel mit rein.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/signup"
            className="rounded-xl text-white font-medium px-6 py-3 transition active:scale-[0.985]"
            style={{ background: "var(--gradient-warm)" }}
          >
            Loslegen
          </Link>
          <Link
            href="/login"
            className="rounded-xl font-medium px-6 py-3 transition active:scale-[0.985]"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-line)",
              color: "var(--color-ink)",
            }}
          >
            Einloggen
          </Link>
        </div>
      </div>
    </main>
  );
}