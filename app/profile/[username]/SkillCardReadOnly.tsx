type Skill = {
  id: string;
  name: string;
  description: string | null;
  base_points: number;
  deadline: string;
  status: string;
  completed_at: string | null;
  points_earned: number | null;
  created_at: string;
};

type Participant = { username: string; display_name: string | null };

function getDaysLeft(deadline: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dl = new Date(deadline + "T00:00:00");
  return Math.round((dl.getTime() - today.getTime()) / 86400000);
}

function getProgress(createdAt: string, deadline: string): number {
  const start = new Date(createdAt).getTime();
  const end = new Date(deadline + "T00:00:00").getTime();
  if (end <= start) return 100;
  return Math.min(100, Math.max(0, ((Date.now() - start) / (end - start)) * 100));
}

export default function SkillCardReadOnly({
  skill,
  joinAction,
  alreadyJoined = false,
  participants = [],
}: {
  skill: Skill;
  joinAction?: (formData: FormData) => Promise<void>;
  alreadyJoined?: boolean;
  participants?: Participant[];
}) {
  const isCompleted = skill.status === "completed";
  const daysLeft = getDaysLeft(skill.deadline);
  const progress = getProgress(skill.created_at, skill.deadline);

  const wasOnTime = skill.completed_at
    ? skill.completed_at.split("T")[0] <= skill.deadline
    : false;

  const deadlineColor =
    daysLeft < 0
      ? "var(--color-accent)"
      : daysLeft <= 3
      ? "#D97706"
      : "var(--color-ink-soft)";

  const deadlineLabel =
    daysLeft < 0
      ? `Überfällig — ${Math.abs(daysLeft)} ${Math.abs(daysLeft) === 1 ? "Tag" : "Tage"} zu spät`
      : daysLeft === 0
      ? "Deadline heute"
      : `${daysLeft} ${daysLeft === 1 ? "Tag" : "Tage"} verbleibend`;

  return (
    <div
      className="rounded-3xl p-5 flex flex-col gap-3"
      style={{
        background: "var(--color-bg-elevated)",
        border: "1px solid var(--color-line)",
        opacity: isCompleted ? 0.8 : 1,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3
          className="font-medium leading-snug"
          style={{ color: "var(--color-ink)" }}
        >
          {skill.name}
        </h3>
        <span
          className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-lg"
          style={
            isCompleted && !wasOnTime
              ? {
                  background: "var(--color-bg-subtle)",
                  color: "var(--color-ink-muted)",
                }
              : { background: "#FCE6E0", color: "#9B2C2C" }
          }
        >
          {isCompleted
            ? `+${skill.points_earned} P${!wasOnTime ? " (50%)" : ""}`
            : `+${skill.base_points} P`}
        </span>
      </div>

      {skill.description && (
        <p
          className="text-sm line-clamp-2"
          style={{ color: "var(--color-ink-muted)" }}
        >
          {skill.description}
        </p>
      )}

      {!isCompleted ? (
        <p className="text-xs" style={{ color: deadlineColor }}>
          {deadlineLabel}
        </p>
      ) : (
        skill.completed_at && (
          <p className="text-xs" style={{ color: "var(--color-ink-soft)" }}>
            Abgeschlossen{" "}
            {new Date(skill.completed_at).toLocaleDateString("de-DE")}
          </p>
        )
      )}

      {!isCompleted && (
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ background: "var(--color-line)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background:
                daysLeft < 0 ? "var(--color-accent)" : "var(--gradient-warm)",
            }}
          />
        </div>
      )}

      {/* Participants */}
      {participants.length > 0 && (
        <p className="text-xs" style={{ color: "var(--color-ink-soft)" }}>
          Mit {participants.map((p) => `@${p.username}`).join(", ")}
        </p>
      )}

      {/* Mitmachen */}
      {!isCompleted && joinAction && (
        <form action={joinAction}>
          {alreadyJoined ? (
            <p
              className="text-xs font-medium"
              style={{ color: "var(--color-accent)" }}
            >
              ✓ Du machst auch mit
            </p>
          ) : (
            <button
              type="submit"
              className="w-full rounded-xl text-white text-xs font-medium py-2 transition active:scale-[0.985] cursor-pointer"
              style={{ background: "var(--gradient-warm)" }}
            >
              Mitmachen
            </button>
          )}
        </form>
      )}
    </div>
  );
}
