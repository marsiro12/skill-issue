"use client";

import { useState, useTransition } from "react";
import { completeSkill, deleteSkill } from "./actions";
import SkillModal from "./SkillModal";

type Skill = {
  id: string;
  name: string;
  description: string | null;
  base_points: number;
  deadline: string;
  status: "active" | "completed";
  completed_at: string | null;
  points_earned: number | null;
  created_at: string;
  source_skill_id: string | null;
};

type Coparticipant = { username: string; display_name: string | null };

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

export default function SkillCard({
  skill,
  coparticipants = [],
}: {
  skill: Skill;
  coparticipants?: Coparticipant[];
}) {
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  const isCompleted = skill.status === "completed";
  const daysLeft = getDaysLeft(skill.deadline);
  const progress = getProgress(skill.created_at, skill.deadline);

  const wasOnTime = skill.completed_at
    ? skill.completed_at.split("T")[0] <= skill.deadline
    : false;

  function handleComplete() {
    setCelebrating(true);
    startTransition(async () => {
      await completeSkill(skill.id);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteSkill(skill.id);
    });
  }

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
      className="rounded-3xl p-5 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-px"
      style={{
        background: "var(--color-bg-elevated)",
        border: "1px solid var(--color-line)",
        opacity: isCompleted ? 0.8 : 1,
      }}
    >
      {/* Name + badge */}
      <div className="flex items-start justify-between gap-3">
        <h3
          className="font-medium leading-snug"
          style={{ color: "var(--color-ink)" }}
        >
          {skill.name}
        </h3>
        <span
          className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-lg transition-transform duration-300 ${celebrating ? "scale-125" : "scale-100"}`}
          style={
            isCompleted && !wasOnTime
              ? { background: "var(--color-bg-subtle)", color: "var(--color-ink-muted)" }
              : { background: "#FCE6E0", color: "#9B2C2C" }
          }
        >
          {isCompleted
            ? `+${skill.points_earned} P${!wasOnTime ? " (50%)" : ""}`
            : `+${skill.base_points} P`}
        </span>
      </div>

      {/* Description */}
      {skill.description && (
        <p
          className="text-sm line-clamp-2"
          style={{ color: "var(--color-ink-muted)" }}
        >
          {skill.description}
        </p>
      )}

      {/* Deadline or completion date */}
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

      {/* Progress bar (active only) */}
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

      {/* Coparticipants */}
      {coparticipants.length > 0 && (
        <p className="text-xs" style={{ color: "var(--color-ink-soft)" }}>
          Mit{" "}
          {coparticipants
            .map((p) => `@${p.username}`)
            .join(", ")}
        </p>
      )}

      {/* Actions */}
      {!isCompleted && (
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleComplete}
            disabled={isPending}
            className="flex-1 rounded-xl text-white text-xs font-medium py-2 transition active:scale-[0.985] cursor-pointer disabled:opacity-60"
            style={{ background: "var(--gradient-warm)" }}
          >
            Geschafft ✓
          </button>

          <SkillModal
            skill={skill}
            trigger={
              <button
                className="rounded-xl text-xs font-medium px-3 py-2 transition active:scale-[0.985] cursor-pointer"
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-line)",
                  color: "var(--color-ink-muted)",
                }}
              >
                Bearbeiten
              </button>
            }
          />

          {confirmDelete ? (
            <div className="flex gap-1.5 items-center">
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-xl text-xs font-medium px-2.5 py-2 transition cursor-pointer disabled:opacity-60"
                style={{
                  background: "var(--color-danger-bg)",
                  color: "var(--color-danger-ink)",
                }}
              >
                Löschen
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs transition cursor-pointer"
                style={{ color: "var(--color-ink-soft)" }}
              >
                Nein
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="rounded-xl text-xs px-2.5 py-2 transition cursor-pointer hover:opacity-70"
              style={{ color: "var(--color-ink-soft)" }}
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Completed: only delete */}
      {isCompleted && (
        <div className="flex justify-end pt-1">
          {confirmDelete ? (
            <div className="flex gap-2 items-center">
              <span className="text-xs" style={{ color: "var(--color-ink-soft)" }}>
                Wirklich löschen?
              </span>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="text-xs font-medium transition cursor-pointer disabled:opacity-60"
                style={{ color: "var(--color-danger-ink)" }}
              >
                Ja
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs transition cursor-pointer"
                style={{ color: "var(--color-ink-soft)" }}
              >
                Nein
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-xs transition cursor-pointer hover:opacity-70"
              style={{ color: "var(--color-ink-soft)" }}
            >
              Löschen
            </button>
          )}
        </div>
      )}
    </div>
  );
}
