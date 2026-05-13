import { createClient } from "@/lib/supabase/server";
import SkillModal from "./SkillModal";
import { addWishlistItem, deleteWishlistItem } from "./wishlistActions";

export default async function WishlistSection() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: items } = await supabase
    .from("wishlist")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <section className="mt-10">
      <div className="flex items-center gap-2.5 mb-4">
        <h2
          className="text-lg font-medium tracking-tight"
          style={{ color: "var(--color-ink)" }}
        >
          Wunschliste
        </h2>
        {items && items.length > 0 && (
          <span
            className="text-xs tabular-nums px-2 py-0.5 rounded-lg"
            style={{
              background: "var(--color-bg-subtle)",
              color: "var(--color-ink-soft)",
            }}
          >
            {items.length}
          </span>
        )}
      </div>

      {/* Add form */}
      <form action={addWishlistItem} className="space-y-2 mb-4">
        <input
          name="name"
          type="text"
          required
          maxLength={100}
          placeholder="Was willst du irgendwann können?"
          className="w-full rounded-xl px-3.5 py-2.5 text-sm transition outline-none"
          style={{
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-line)",
            color: "var(--color-ink)",
          }}
        />
        <div className="flex gap-2">
          <input
            name="description"
            type="text"
            maxLength={300}
            placeholder="Notiz (optional)"
            className="flex-1 rounded-xl px-3.5 py-2.5 text-sm transition outline-none"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-line)",
              color: "var(--color-ink)",
            }}
          />
          <button
            type="submit"
            className="rounded-xl text-white font-medium px-4 py-2.5 text-sm transition active:scale-[0.985] cursor-pointer shrink-0"
            style={{ background: "var(--gradient-warm)" }}
          >
            + Merken
          </button>
        </div>
      </form>

      {/* List */}
      {items && items.length > 0 ? (
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

              <div className="flex items-center gap-2 shrink-0 pt-0.5">
                <SkillModal
                  prefill={{ name: item.name, description: item.description }}
                  trigger={
                    <button
                      className="rounded-lg text-xs font-medium px-2.5 py-1.5 transition active:scale-[0.985] cursor-pointer"
                      style={{
                        background: "var(--color-bg-subtle)",
                        border: "1px solid var(--color-line)",
                        color: "var(--color-ink-muted)",
                      }}
                    >
                      Angehen
                    </button>
                  }
                />
                <form action={deleteWishlistItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    className="text-xs transition cursor-pointer hover:opacity-70"
                    style={{ color: "var(--color-ink-soft)" }}
                    title="Entfernen"
                  >
                    ✕
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="rounded-2xl border border-dashed p-6 text-center"
          style={{ borderColor: "var(--color-line-strong)" }}
        >
          <p className="text-sm" style={{ color: "var(--color-ink-soft)" }}>
            Noch keine Wünsche. Trag ein was dir vorschwebt — auch wenn du
            noch keine Zeit dafür hast.
          </p>
        </div>
      )}
    </section>
  );
}
