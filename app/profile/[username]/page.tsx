import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SkillCardReadOnly from "./SkillCardReadOnly";
import WishlistSection from "./WishlistSection";
import { joinSkill } from "@/app/dashboard/actions";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  if (profile.id === user!.id) redirect("/dashboard");

  const [{ data: iFollowRow }, { data: theyFollowRow }] = await Promise.all([
    supabase
      .from("follows")
      .select("follower_id")
      .eq("follower_id", user!.id)
      .eq("following_id", profile.id)
      .maybeSingle(),
    supabase
      .from("follows")
      .select("follower_id")
      .eq("follower_id", profile.id)
      .eq("following_id", user!.id)
      .maybeSingle(),
  ]);

  const isMutual = !!iFollowRow && !!theyFollowRow;

  const { data: skills } = isMutual
    ? await supabase
        .from("skills")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  const activeSkills = skills?.filter((s) => s.status === "active") ?? [];
  const completedSkills = skills?.filter((s) => s.status === "completed") ?? [];
  const totalPoints = completedSkills.reduce(
    (sum, s) => sum + (s.points_earned ?? 0),
    0
  );

  // Who already joined which skill, and other participants
  const friendSkillIds = [...activeSkills, ...completedSkills].map((s) => s.id);
  let alreadyJoinedIds = new Set<string>();
  const participantsBySkill: Record<
    string,
    Array<{ username: string; display_name: string | null }>
  > = {};

  if (isMutual && friendSkillIds.length > 0) {
    const [{ data: myJoined }, { data: joinedByOthers }] = await Promise.all([
      supabase
        .from("skills")
        .select("source_skill_id")
        .eq("user_id", user!.id)
        .in("source_skill_id", friendSkillIds),
      supabase
        .from("skills")
        .select("source_skill_id, user_id")
        .in("source_skill_id", friendSkillIds)
        .neq("user_id", user!.id)
        .neq("user_id", profile.id),
    ]);

    alreadyJoinedIds = new Set(
      myJoined?.map((r) => r.source_skill_id).filter(Boolean) ?? []
    );

    const participantUserIds = [
      ...new Set(joinedByOthers?.map((r) => r.user_id) ?? []),
    ];
    if (participantUserIds.length > 0) {
      const { data: pProfiles } = await supabase
        .from("profiles")
        .select("id, username, display_name")
        .in("id", participantUserIds);

      for (const js of joinedByOthers ?? []) {
        const sid = js.source_skill_id;
        if (!participantsBySkill[sid]) participantsBySkill[sid] = [];
        const p = pProfiles?.find((pr) => pr.id === js.user_id);
        if (
          p &&
          !participantsBySkill[sid].find((cp) => cp.username === p.username)
        ) {
          participantsBySkill[sid].push(p);
        }
      }
    }
  }

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
          <Link
            href="/dashboard"
            className="text-sm transition hover:opacity-70"
            style={{ color: "var(--color-ink-muted)" }}
          >
            ← Zurück
          </Link>
        </header>

        <div className="animate-fadeUp">
          <p
            className="text-sm mb-2"
            style={{ color: "var(--color-ink-muted)" }}
          >
            Profil
          </p>
          <h1
            className="text-4xl font-medium tracking-tight mb-8"
            style={{ color: "var(--color-ink)" }}
          >
            {profile.display_name ?? profile.username}
          </h1>

          {!isMutual ? (
            <div
              className="rounded-3xl p-10 text-center"
              style={{
                background: "var(--color-bg-elevated)",
                border: "1px solid var(--color-line)",
              }}
            >
              <p
                className="text-sm mb-1"
                style={{ color: "var(--color-ink-muted)" }}
              >
                Ihr folgt euch noch nicht gegenseitig.
              </p>
              <p className="text-sm" style={{ color: "var(--color-ink-soft)" }}>
                Skills werden sichtbar, sobald beide Seiten folgen.
              </p>
            </div>
          ) : (
            <>
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

              <h2
                className="text-lg font-medium tracking-tight mb-4"
                style={{ color: "var(--color-ink)" }}
              >
                Skills
              </h2>

              {activeSkills.length === 0 ? (
                <div
                  className="rounded-3xl border border-dashed p-10 text-center mb-6"
                  style={{ borderColor: "var(--color-line-strong)" }}
                >
                  <p className="text-sm" style={{ color: "var(--color-ink-soft)" }}>
                    Keine aktiven Skills gerade.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  {activeSkills.map((skill) => (
                    <SkillCardReadOnly
                      key={skill.id}
                      skill={skill}
                      joinAction={joinSkill.bind(null, skill.id)}
                      alreadyJoined={alreadyJoinedIds.has(skill.id)}
                      participants={participantsBySkill[skill.id] ?? []}
                    />
                  ))}
                </div>
              )}

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
                      <SkillCardReadOnly
                        key={skill.id}
                        skill={skill}
                        joinAction={joinSkill.bind(null, skill.id)}
                        alreadyJoined={alreadyJoinedIds.has(skill.id)}
                        participants={participantsBySkill[skill.id] ?? []}
                      />
                    ))}
                  </div>
                </div>
              )}

              <WishlistSection profileId={profile.id} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
