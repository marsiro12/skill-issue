"use client";

import { useRef, useState, useTransition } from "react";
import { addSkill, updateSkill } from "./actions";

type Skill = {
  id: string;
  name: string;
  description: string | null;
  base_points: number;
  deadline: string;
};

type Prefill = { name?: string; description?: string | null };

type Props = {
  skill?: Skill;
  trigger?: React.ReactNode;
  prefill?: Prefill;
};

export default function SkillModal({ skill, trigger, prefill }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = !!skill;
  const today = new Date().toISOString().split("T")[0];

  function handleOpen() {
    setError(null);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setError(null);
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        if (isEdit) {
          await updateSkill(formData);
        } else {
          await addSkill(formData);
          formRef.current?.reset();
        }
        setOpen(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Fehler aufgetreten");
      }
    });
  }

  return (
    <>
      <div onClick={handleOpen} className="inline-block">
        {trigger ?? (
          <button
            className="rounded-xl text-white font-medium px-4 py-2 text-sm transition active:scale-[0.985] cursor-pointer"
            style={{ background: "var(--gradient-warm)" }}
          >
            + Neuer Skill
          </button>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(26,24,20,0.5)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div
            className="w-full max-w-md rounded-3xl p-7 animate-fadeUp"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-line)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl font-medium tracking-tight"
                style={{ color: "var(--color-ink)" }}
              >
                {isEdit ? "Skill bearbeiten" : "Neuer Skill"}
              </h2>
              <button
                onClick={handleClose}
                className="text-lg leading-none transition hover:opacity-60 cursor-pointer"
                style={{ color: "var(--color-ink-soft)" }}
              >
                ✕
              </button>
            </div>

            <form ref={formRef} action={handleSubmit} className="space-y-4">
              {isEdit && (
                <input type="hidden" name="skillId" value={skill.id} />
              )}

              <div>
                <label
                  htmlFor="modal-name"
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  Name
                </label>
                <input
                  id="modal-name"
                  name="name"
                  type="text"
                  required
                  maxLength={100}
                  defaultValue={skill?.name ?? prefill?.name ?? ""}
                  placeholder="z.B. Jonglieren mit 3 Bällen"
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
                  htmlFor="modal-description"
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  Beschreibung{" "}
                  <span style={{ color: "var(--color-ink-soft)" }}>
                    (optional)
                  </span>
                </label>
                <textarea
                  id="modal-description"
                  name="description"
                  maxLength={500}
                  rows={3}
                  defaultValue={skill?.description ?? prefill?.description ?? ""}
                  placeholder="Was genau willst du können?"
                  className="w-full rounded-xl px-3.5 py-2.5 text-sm transition outline-none resize-none"
                  style={{
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-line)",
                    color: "var(--color-ink)",
                  }}
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label
                    htmlFor="modal-points"
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "var(--color-ink-muted)" }}
                  >
                    Punkte
                  </label>
                  <input
                    id="modal-points"
                    name="base_points"
                    type="number"
                    required
                    min={1}
                    max={5000}
                    defaultValue={skill?.base_points}
                    placeholder="100"
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm transition outline-none"
                    style={{
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-line)",
                      color: "var(--color-ink)",
                    }}
                  />
                </div>

                <div className="flex-1">
                  <label
                    htmlFor="modal-deadline"
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "var(--color-ink-muted)" }}
                  >
                    Deadline
                  </label>
                  <input
                    id="modal-deadline"
                    name="deadline"
                    type="date"
                    required
                    min={isEdit ? undefined : today}
                    defaultValue={skill?.deadline}
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm transition outline-none"
                    style={{
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-line)",
                      color: "var(--color-ink)",
                    }}
                  />
                </div>
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

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 rounded-xl font-medium py-2.5 text-sm transition active:scale-[0.985] cursor-pointer"
                  style={{
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-line)",
                    color: "var(--color-ink-muted)",
                  }}
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 rounded-xl text-white font-medium py-2.5 text-sm transition active:scale-[0.985] cursor-pointer disabled:opacity-60"
                  style={{ background: "var(--gradient-warm)" }}
                >
                  {isPending ? "..." : isEdit ? "Speichern" : "Erstellen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
