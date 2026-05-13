import Link from "next/link";
import { followUser, unfollowUser } from "./friendActions";

type Profile = {
  id: string;
  username: string;
  display_name: string | null;
};

type Props = {
  mutualFriends: Profile[];
  pendingFollows: Profile[];
  friendError?: string;
};

export default function FriendsSection({
  mutualFriends,
  pendingFollows,
  friendError,
}: Props) {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-lg font-medium tracking-tight"
          style={{ color: "var(--color-ink)" }}
        >
          Freunde
        </h2>
      </div>

      {/* Add friend */}
      <form action={followUser} className="flex gap-2 mb-4">
        <input
          name="username"
          type="text"
          required
          placeholder="Username deines Kumpels"
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
          Folgen
        </button>
      </form>

      {friendError && (
        <p
          className="text-sm rounded-xl px-3 py-2 mb-4"
          style={{
            background: "var(--color-danger-bg)",
            color: "var(--color-danger-ink)",
          }}
        >
          {friendError}
        </p>
      )}

      {/* Mutual friends */}
      {mutualFriends.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {mutualFriends.map((friend) => (
            <div
              key={friend.id}
              className="rounded-2xl p-4 flex items-center justify-between gap-3"
              style={{
                background: "var(--color-bg-elevated)",
                border: "1px solid var(--color-line)",
              }}
            >
              <div className="min-w-0">
                <p
                  className="font-medium text-sm truncate"
                  style={{ color: "var(--color-ink)" }}
                >
                  {friend.display_name ?? friend.username}
                </p>
                <p className="text-xs" style={{ color: "var(--color-ink-soft)" }}>
                  @{friend.username}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/profile/${friend.username}`}
                  className="rounded-xl text-xs font-medium px-3 py-1.5 transition active:scale-[0.985]"
                  style={{
                    background: "var(--color-bg-subtle)",
                    color: "var(--color-ink-muted)",
                    border: "1px solid var(--color-line)",
                  }}
                >
                  Profil →
                </Link>
                <form action={unfollowUser}>
                  <input type="hidden" name="followingId" value={friend.id} />
                  <button
                    type="submit"
                    className="text-xs transition cursor-pointer hover:opacity-70"
                    style={{ color: "var(--color-ink-soft)" }}
                    title="Entfolgen"
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
          className="rounded-2xl border border-dashed p-6 text-center mb-4"
          style={{ borderColor: "var(--color-line-strong)" }}
        >
          <p className="text-sm" style={{ color: "var(--color-ink-soft)" }}>
            Noch keine Freunde. Trag den Username deines Kumpels ein — sobald
            ihr euch gegenseitig folgt, erscheint er hier.
          </p>
        </div>
      )}

      {/* Pending follows */}
      {pendingFollows.length > 0 && (
        <div>
          <p
            className="text-xs uppercase tracking-wider mb-2"
            style={{ color: "var(--color-ink-soft)" }}
          >
            Du folgst — wartet auf Gegenseitigkeit
          </p>
          <div className="space-y-2">
            {pendingFollows.map((p) => (
              <div
                key={p.id}
                className="rounded-xl px-4 py-3 flex items-center justify-between"
                style={{ background: "var(--color-bg-subtle)" }}
              >
                <div>
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-ink-muted)" }}
                  >
                    {p.display_name ?? p.username}
                  </span>
                  <span
                    className="text-xs ml-1.5"
                    style={{ color: "var(--color-ink-soft)" }}
                  >
                    @{p.username}
                  </span>
                </div>
                <form action={unfollowUser}>
                  <input type="hidden" name="followingId" value={p.id} />
                  <button
                    type="submit"
                    className="text-xs transition cursor-pointer hover:opacity-70"
                    style={{ color: "var(--color-ink-soft)" }}
                  >
                    Entfolgen
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
