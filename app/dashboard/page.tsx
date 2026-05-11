import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name")
    .eq("id", user!.id)
    .single();

  return (
    <main className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2.5">
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
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="text-sm transition hover:opacity-70 cursor-pointer"
              style={{ color: "var(--color-ink-muted)" }}
            >
              Ausloggen
            </button>
          </form>
        </header>

        <div className="animate-fadeUp">
          <p
            className="text-sm mb-2"
            style={{ color: "var(--color-ink-muted)" }}
          >
            Servus
          </p>
          <h1
            className="text-4xl font-medium tracking-tight mb-10"
            style={{ color: "var(--color-ink)" }}
          >
            {profile?.display_name ?? user?.email?.split("@")[0]}
          </h1>

          <div
            className="rounded-3xl p-8"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-line)",
            }}
          >
            <h2
              className="text-lg font-medium tracking-tight mb-1"
              style={{ color: "var(--color-ink)" }}
            >
              Deine Skills
            </h2>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--color-ink-muted)" }}
            >
              Hier landen deine Skills. Bauen wir im nächsten Milestone.
            </p>

            <div
              className="rounded-2xl border border-dashed p-8 text-center"
              style={{ borderColor: "var(--color-line-strong)" }}
            >
              <p
                className="text-sm"
                style={{ color: "var(--color-ink-soft)" }}
              >
                Noch leer. Bald liegen hier Jonglieren, Italienisch und Co.
              </p>
            </div>
          </div>

          <div
            className="mt-6 rounded-2xl p-5 text-sm space-y-1.5"
            style={{
              background: "var(--color-bg-subtle)",
              color: "var(--color-ink-muted)",
            }}
          >
            <p
              className="text-xs uppercase tracking-wider mb-2"
              style={{ color: "var(--color-ink-soft)" }}
            >
              Eingeloggt als
            </p>
            <p>
              <span style={{ color: "var(--color-ink-soft)" }}>Email:</span>{" "}
              {user?.email}
            </p>
            <p>
              <span style={{ color: "var(--color-ink-soft)" }}>Username:</span>{" "}
              {profile?.username}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
