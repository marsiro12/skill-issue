import { createClient } from "@/lib/supabase/server";
import SkillModal from "./SkillModal";
import SkillCard from "./SkillCard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: skills }] = await Promise.all([
    supabase
      .from("profiles")
      .select("username, display_name")
      .eq("id", user!.id)
      .single(),
    supabase
      .from("skills")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false }),
  ]);

  const activeSkills = skills?.filter((s) => s.status === "active") ?? [];
  const completedSkills = skills?.filter((s) => s.status === "completed") ?? [];
  const totalPoints = completedSkills.reduce(
    (sum, s) => sum + (s.points_earned ?? 0),
    0
  );

  return (
    <main className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
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
          {/* Greeting */}
          <p className="text-sm mb-2" style={{ color: "var(--color-ink-muted)" }}>
            Servus
          </p>
          <h1
            className="text-4xl font-medium tracking-tight mb-8"
            style={{ color: "var(--color-ink)" }}
          >
            {profile?.display_name ?? user?.email?.split("@")[0]}
          </h1>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {(
              [
                { label: "Gesamtpunkte", value: totalPoints },
                { label: "Aktive Skills", value: activeSkills.length },
                { label: "Abgeschlossen", value: completedSkills.length },
              ] as const
            ).map(({ label, value }) => (
              <div
                key={label}
                className="rounded-2xl p-4"
                style={{
                  background: "var(--color-bg-elevated)",
                  border: "1px solid var(--color-line)",
                }}
              >
                <p
                  className="text-2xl font-medium tabular-nums"
                  style={{ color: "var(--color-ink)" }}
                >
                  {value}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--color-ink-soft)" }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Active skills */}
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-lg font-medium tracking-tight"
              style={{ color: "var(--color-ink)" }}
            >
              Deine Skills
            </h2>
            <SkillModal />
          </div>

          {activeSkills.length === 0 ? (
            <div
              className="rounded-3xl border border-dashed p-10 text-center mb-6"
              style={{ borderColor: "var(--color-line-strong)" }}
            >
              <p
                className="text-sm mb-5"
                style={{ color: "var(--color-ink-soft)" }}
              >
                Noch leer. Bald liegen hier Jonglieren, Italienisch und Co.
              </p>
              <SkillModal />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {activeSkills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          )}

          {/* Completed skills */}
          {completedSkills.length > 0 && (
            <div className="mt-8">
              <h2
                className="text-xs font-medium uppercase tracking-wider mb-3"
                style={{ color: "var(--color-ink-soft)" }}
              >
                Abgeschlossen
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {completedSkills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
