import { createClient } from "@/lib/supabase/server";
import SkillModal from "@/app/dashboard/SkillModal";

export default async function WishlistSection({
  profileId,
}: {
  profileId: string;
}) {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("wishlist")
    .select("*")
    .eq("user_id", profileId)
    .order("created_at", { ascending: false });

  if (!items || items.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="flex items-center gap-2.5 mb-4">
        <h2
          className="text-lg font-medium tracking-tight"
          style={{ color: "var(--color-ink)" }}
        >
          Wunschliste
        </h2>
        <span
          className="text-xs tabular-nums px-2 py-0.5 rounded-lg"
          style={{
            background: "var(--color-bg-subtle)",
            color: "var(--color-ink-soft)",
          }}
        >
          {items.length}
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl px-4 py-3.5 flex items-start justify-between gap-3"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-line)",
            }}
          >
            <div className="flex-1 min-w-0">
              <p
                className="font-medium text-sm"
                style={{ color: "var(--color-ink)" }}
              >
                {item.name}
              </p>
              {item.description && (
                <p
                  className="text-xs mt-0.5 line-clamp-1"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  {item.description}
                </p>
              )}
              <p
                className="text-xs mt-1"
                style={{ color: "var(--color-ink-soft)" }}
              >
                Idee vom{" "}
                {new Date(item.created_at).toLocaleDateString("de-DE")}
              </p>
            </div>

            <SkillModal
              prefill={{ name: item.name, description: item.description }}
              trigger={
                <button
                  className="rounded-xl text-xs font-medium px-3 py-1.5 transition active:scale-[0.985] cursor-pointer shrink-0"
                  style={{ background: "var(--gradient-warm)", color: "white" }}
                >
                  Übernehmen
                </button>
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
}
