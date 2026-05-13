import Link from "next/link";
import { signup } from "../login/actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="w-full max-w-sm animate-fadeUp">
        <Link
          href="/"
          className="flex items-center gap-2.5 justify-center mb-10"
        >
          <span
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--gradient-warm)" }}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
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
            className="text-xl font-medium tracking-tight"
            style={{ color: "var(--color-ink)" }}
          >
            Skill Issue
          </span>
        </Link>

        <div
          className="rounded-3xl p-7"
          style={{
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-line)",
          }}
        >
          <div className="mb-6">
            <h1
              className="text-2xl font-medium tracking-tight mb-1"
              style={{ color: "var(--color-ink)" }}
            >
              Skill Issue beitreten
            </h1>
            <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
              Mit Email registrieren. Dauert 10 Sekunden.
            </p>
          </div>

          <form action={signup} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--color-ink-muted)" }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoFocus
                autoComplete="email"
                placeholder="du@beispiel.de"
                className="w-full rounded-xl px-3.5 py-2.5 text-sm transition outline-none"
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-line)",
                  color: "var(--color-ink)",
                }}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--color-ink-muted)" }}
              >
                Passwort
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full rounded-xl px-3.5 py-2.5 text-sm transition outline-none"
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-line)",
                  color: "var(--color-ink)",
                }}
              />
              <p
                className="text-xs mt-1"
                style={{ color: "var(--color-ink-soft)" }}
              >
                Mindestens 6 Zeichen
              </p>
            </div>

            {error && (
              <p
                className="text-sm rounded-xl px-3 py-2"
                style={{
                  background: "var(--color-danger-bg)",
                  color: "var(--color-danger-ink)",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl text-white font-medium py-2.5 mt-2 transition active:scale-[0.985] cursor-pointer"
              style={{ background: "var(--gradient-warm)" }}
            >
              Account erstellen
            </button>
          </form>
        </div>

        <p
          className="text-center mt-6 text-sm"
          style={{ color: "var(--color-ink-muted)" }}
        >
          Schon ein Account?{" "}
          <Link
            href="/login"
            className="font-medium"
            style={{ color: "var(--color-accent)" }}
          >
            Einloggen
          </Link>
        </p>
      </div>
    </main>
  );
}
