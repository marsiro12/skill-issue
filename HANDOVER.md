# Skill Issue — Project Handover

This document is the complete context for the Skill Issue project, prepared in a Claude.ai web chat session. Claude Code should read this in full, then implement Milestone 2 (auth) by creating the files listed below, and stand ready for Milestone 3 (skills CRUD) when the user confirms M2 is working.

---

## Context

**Project name:** Skill Issue

**What it is:** A web app where friends learn skills together with deadlines and a self-defined point system. Two people commit to a skill (e.g. juggling, a card trick, a language) by a date, set a point value reflecting difficulty/time, and track each other's progress. Later may expand to a mobile app.

**User:** Beginner with code, native German speaker. Has accounts on Supabase, Vercel, and GitHub. Has worked with Claude before but is new to Next.js patterns. Prefers step-by-step guidance with brief why-explanations. Already deployed a default Next.js to Vercel at `skill-issue-nine.vercel.app` and has the Supabase project running with full schema applied.

**Communication style:** Respond in German. Be concise. Explain the "why" briefly when introducing new concepts (Server Actions, RLS, Next.js patterns). Pick one chunk, do it, verify, move on. Don't dump multiple milestones at once. Tone is casual, slightly cheeky — matches the brand.

---

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- Supabase (Auth + Postgres + Row Level Security)
- Vercel (deployed, auto-deploys from GitHub main branch)
- GitHub (repo connected)
- `@supabase/supabase-js` and `@supabase/ssr` (already installed)
- Bricolage Grotesque via `next/font/google`

---

## Setup Already Complete

- [x] Supabase project created
- [x] Database schema deployed (see Schema section below)
- [x] Next.js project bootstrapped via `create-next-app` in `C:\Dev\skill-issue` (or wherever the user kept it)
- [x] Supabase packages installed
- [x] `.env.local` set with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [x] GitHub repo connected
- [x] Vercel deployment live with env vars set
- [x] Supabase email confirmation disabled (Authentication → Email → Confirm email = OFF) for MVP testing

---

## Design Direction: Warm Editorial

**Aesthetic philosophy:** Explicitly avoid the AI-default "purple gradient on white" look. Commit to a warm, slightly cheeky, editorial vibe — somewhere between a niche running app and small-batch coffee shop branding.

**Color tokens** (lives in `src/app/globals.css`):

| Token | Value | Purpose |
|---|---|---|
| `--color-bg` | `#FDFBF7` | Warm cream page background |
| `--color-bg-elevated` | `#FFFFFF` | Cards and surfaces |
| `--color-bg-subtle` | `#F5F1E8` | Subtle muted background |
| `--color-ink` | `#1A1814` | Primary text (warm near-black) |
| `--color-ink-muted` | `#6B6760` | Secondary text |
| `--color-ink-soft` | `#9C988F` | Tertiary text |
| `--color-line` | `#ECE7DC` | Default borders |
| `--color-line-strong` | `#D6CFC2` | Emphasized borders, dashed states |
| `--color-accent` | `#FF6B6B` | Coral — primary accent |
| `--color-accent-warm` | `#FFA552` | Orange — gradient end |
| `--color-accent-cool` | `#7C6FE8` | Lavender — reserved for later (friend/social UI) |
| `--gradient-warm` | `linear-gradient(135deg, #FF6B6B 0%, #FFA552 100%)` | Buttons, logo mark |

**Typography:** Bricolage Grotesque (variable, slightly playful, distinctive — chosen over generic Inter/Roboto). Two weights only: 400 regular, 500 medium. Use `font-variant-numeric: tabular-nums` so points line up cleanly.

**Border radius:** Generous — `0.75rem` for inputs and small buttons, `1rem` for primary buttons, `1.5rem` (`rounded-3xl`) for cards.

**Motion:** Subtle. `@keyframes fadeUp` (opacity 0 → 1, translateY 8px → 0, 0.45s ease-out) on main content. Buttons: `active:scale-[0.985]`. Inputs: focus ring in `--color-accent-warm` with low-opacity halo.

**Logo mark:** Lightning bolt SVG path `M13 2 L4 14 L11 14 L11 22 L20 10 L13 10 Z`, rendered white inside a coral-orange gradient pill.

**Tone of copy (German):** Direct, casual, slightly cheeky. Examples used:
- "Servus" (greeting)
- "Halt dich accountable"
- "Wo waren wir stehen geblieben?"
- "Dauert 10 Sekunden"
- "Bald liegen hier Jonglieren, Italienisch und Co."

---

## MVP Scope

**In scope:**
- Email + password auth
- Own profile + skills CRUD
- Skill fields: name (required), description (optional), `base_points` (user-defined, integer > 0), deadline (date)
- Skill completion: 100% of `base_points` if `completed_at <= deadline`, otherwise `floor(base_points / 2)` (Variant B chosen by user)
- Mutual friend follow (only visible when both directions exist)
- Friend profile page (read-only, same shape as own dashboard)

**Out of scope for MVP** (deferred to later phases):
- Activity feed
- Notifications / invites
- Joint challenges (both users on same skill at once)
- Video uploads
- Mobile app
- Skill catalog / community suggestions

---

## Database Schema (Already Deployed)

```sql
-- 1. PROFILES (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null
);

-- 2. SKILLS
create table public.skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  base_points integer not null check (base_points > 0),
  deadline date not null,
  status text not null default 'active' check (status in ('active', 'completed')),
  completed_at timestamptz,
  points_earned integer check (points_earned >= 0),
  created_at timestamptz default now() not null
);

create index skills_user_id_idx on public.skills(user_id);

-- 3. FOLLOWS (mutual = friendship when both directions exist)
create table public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now() not null,
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

create index follows_following_id_idx on public.follows(following_id);

-- RLS enabled on all three tables.
-- Profiles: SELECT for authenticated, INSERT/UPDATE only own.
-- Follows: SELECT for authenticated, INSERT/DELETE only own (where auth.uid() = follower_id).
-- Skills: SELECT own + mutual-follows-friends, INSERT/UPDATE/DELETE only own.
-- Trigger handle_new_user auto-creates a profile row on auth.users INSERT,
-- using email prefix as username and display_name.
```

---

## Milestone Status

- [x] M1: Project setup, Supabase, schema, Vercel deploy
- [ ] **M2: Auth flow ← CURRENT, files specified below**
- [ ] M3: Skills CRUD
- [ ] M4: Friend system + profile pages
- [ ] M5: Polish (gradient details, micro-animations, mobile responsiveness)

---

## Milestone 2: Auth Files to Create

Create or replace the following twelve files. All file paths are relative to project root.

**Replace existing:**
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`

**Create new:**
- `src/middleware.ts` (note: directly in `src/`, NOT in `src/app/`)
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/middleware.ts`
- `src/app/login/page.tsx`
- `src/app/login/actions.ts`
- `src/app/signup/page.tsx`
- `src/app/dashboard/page.tsx`
- `src/app/auth/signout/route.ts`

### File: `src/app/globals.css`

```css
@import "tailwindcss";

:root {
  --color-bg: #FDFBF7;
  --color-bg-elevated: #FFFFFF;
  --color-bg-subtle: #F5F1E8;
  --color-ink: #1A1814;
  --color-ink-muted: #6B6760;
  --color-ink-soft: #9C988F;
  --color-line: #ECE7DC;
  --color-line-strong: #D6CFC2;
  --color-accent: #FF6B6B;
  --color-accent-warm: #FFA552;
  --color-accent-cool: #7C6FE8;
  --color-danger-bg: #FDF0F0;
  --color-danger-ink: #9B2C2C;
  --gradient-warm: linear-gradient(135deg, #FF6B6B 0%, #FFA552 100%);
}

@theme inline {
  --color-background: var(--color-bg);
  --color-foreground: var(--color-ink);
  --font-sans: var(--font-bricolage);
}

html,
body {
  background: var(--color-bg);
  color: var(--color-ink);
}

body {
  font-family: var(--font-bricolage), system-ui, sans-serif;
  font-variant-numeric: tabular-nums;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

input:focus,
textarea:focus,
select:focus {
  border-color: var(--color-accent-warm) !important;
  box-shadow: 0 0 0 3px rgba(255, 165, 82, 0.18);
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeUp {
  animation: fadeUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
```

### File: `src/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skill Issue",
  description: "Lern Skills, halt dich accountable.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={bricolage.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

### File: `src/lib/supabase/client.ts`

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### File: `src/lib/supabase/server.ts`

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — middleware refreshes cookies.
          }
        },
      },
    }
  );
}
```

### File: `src/lib/supabase/middleware.ts`

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: do nothing between createServerClient and getUser, or the
  // session refresh logic can break.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isPublic =
    path === "/" ||
    path.startsWith("/login") ||
    path.startsWith("/signup") ||
    path.startsWith("/auth");

  // Not logged in & trying to access a protected page → send to login
  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Logged in & on login/signup → send to dashboard
  if (user && (path === "/login" || path === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

### File: `src/middleware.ts`

```ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

### File: `src/app/page.tsx`

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="max-w-md text-center animate-fadeUp">
        <div className="inline-flex items-center gap-3 mb-10">
          <span
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--gradient-warm)" }}
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
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
            className="text-2xl font-medium tracking-tight"
            style={{ color: "var(--color-ink)" }}
          >
            Skill Issue
          </span>
        </div>

        <h1
          className="text-4xl sm:text-5xl font-medium tracking-tight mb-5 leading-[1.05]"
          style={{ color: "var(--color-ink)" }}
        >
          Lern Skills. <br />
          Halt dich accountable.
        </h1>

        <p
          className="text-base mb-10 max-w-sm mx-auto"
          style={{ color: "var(--color-ink-muted)" }}
        >
          Setz dir konkrete Ziele mit Deadline, sammle Punkte, und zieh deinen Kumpel mit rein.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/signup"
            className="rounded-xl text-white font-medium px-6 py-3 transition active:scale-[0.985]"
            style={{ background: "var(--gradient-warm)" }}
          >
            Loslegen
          </Link>
          <Link
            href="/login"
            className="rounded-xl font-medium px-6 py-3 transition active:scale-[0.985]"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-line)",
              color: "var(--color-ink)",
            }}
          >
            Einloggen
          </Link>
        </div>
      </div>
    </main>
  );
}
```

### File: `src/app/login/actions.ts`

```ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
```

### File: `src/app/login/page.tsx`

```tsx
import Link from "next/link";
import { login } from "./actions";

export default async function LoginPage({
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
              Willkommen zurück
            </h1>
            <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
              Wo waren wir stehen geblieben?
            </p>
          </div>

          <form action={login} className="space-y-4">
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
                className="w-full rounded-xl px-3.5 py-2.5 text-sm transition outline-none"
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-line)",
                  color: "var(--color-ink)",
                }}
              />
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
              Einloggen
            </button>
          </form>
        </div>

        <p
          className="text-center mt-6 text-sm"
          style={{ color: "var(--color-ink-muted)" }}
        >
          Noch kein Account?{" "}
          <Link
            href="/signup"
            className="font-medium"
            style={{ color: "var(--color-accent)" }}
          >
            Registrieren
          </Link>
        </p>
      </div>
    </main>
  );
}
```

### File: `src/app/signup/page.tsx`

```tsx
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
```

### File: `src/app/dashboard/page.tsx`

```tsx
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
```

### File: `src/app/auth/signout/route.ts`

```ts
import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  return NextResponse.redirect(new URL("/login", request.url), {
    status: 303,
  });
}
```

---

## Verification: Test Flow After M2 Files Are in Place

Run dev server:

```powershell
npm run dev
```

Walk through:

1. Open `http://localhost:3000` → see landing page with logo, headline, two CTAs (Loslegen, Einloggen).
2. Click **Loslegen** → signup page.
3. Enter email + password (≥6 chars) → click **Account erstellen** → should redirect to `/dashboard`.
4. Dashboard shows "Servus [email-prefix]", placeholder for skills, and "Eingeloggt als" box with email + username.
5. Click **Ausloggen** → back to `/login`.
6. Enter same credentials → click **Einloggen** → back to dashboard.
7. Try visiting `/dashboard` while logged out → should redirect to `/login`.
8. Try visiting `/login` while logged in → should redirect to `/dashboard`.

If all green, commit and push:

```powershell
git add .
git commit -m "M2: Add auth flow with Supabase"
git push
```

Vercel auto-deploys in 1-2 minutes. Verify the same flow works on the live URL.

---

## Milestone 3: Skills CRUD (Next Up)

Once the user confirms M2 works, build M3.

**Scope:**

- "Neuer Skill" button on dashboard opens a form (modal or dedicated `/skills/new` page — implementer's choice, modal feels more app-y)
- Form fields:
  - `name` (text, required, max ~100 chars)
  - `description` (textarea, optional, max ~500 chars)
  - `base_points` (number input, required, min 1, max maybe 5000 — sanity ceiling)
  - `deadline` (date input, required, must be `>= today`)
- On submit: Server Action inserts into `skills` with `user_id = auth.uid()`, `status = 'active'`
- Dashboard shows active skills as card grid (replace the empty placeholder)
- Each skill card displays:
  - Name (medium weight)
  - Description preview (if present, line-clamp-2, muted color)
  - Points badge (top-right, coral background, `+X P` format)
  - Days-until-deadline indicator (e.g. "9 Tage" or "Überfällig — X Tage zu spät")
  - Subtle progress bar showing time elapsed vs total time available (visually pleasing, not functional)
  - "Geschafft" action (button or menu) to mark complete
- Stats row above skill grid, three metric cards:
  - **Gesamtpunkte** — sum of `points_earned` across all completed skills
  - **Aktive Skills** — count where `status = 'active'`
  - **Abgeschlossen** — count where `status = 'completed'`
- Completion flow:
  - Server Action `completeSkill(skillId)`:
    - Fetch the skill, verify `user_id = auth.uid()` (RLS already enforces, but assert for safety)
    - If `today <= deadline`: `points_earned = base_points`
    - Else: `points_earned = Math.floor(base_points / 2)`
    - Set `status = 'completed'`, `completed_at = now()`
    - `revalidatePath('/dashboard')`
  - On dashboard after completion, the card moves to a "Abgeschlossen" section (or fades to a different visual state — implementer's choice). Subtle micro-celebration on completion (a brief scale animation on the points badge, no confetti).
- Edit and delete:
  - Edit reopens the form pre-filled, updates the row
  - Delete with a confirm step ("Wirklich löschen? Punkte gehen verloren wenn schon abgeschlossen.")

**Design notes:**

- Skill cards: `rounded-3xl`, white bg, `1px` border in `--color-line`. Hover: subtle lift (translate-y -1px, slightly stronger border). Generous padding (~1.25rem).
- Points badge background: light coral (`#FCE6E0` or similar light tint of `--color-accent`), text in `#9B2C2C` or darker coral. Bold, small.
- Late completions: badge becomes muted gray with `+X P (50%)` label.
- Maintain the warm editorial vibe throughout — no new colors, no new fonts, no new shadows. Use existing tokens.

**Data access pattern:**

- All reads via `createClient()` from `@/lib/supabase/server` in Server Components
- All mutations via Server Actions ("use server" directive)
- Never use the browser client for fetching skills data — security and SSR benefits both favor server reads
- RLS already enforces who-can-see-what

---

## Communication Style for User

Continue in German. The user is a coding beginner but very engaged — they want to learn what's happening as we build.

- Pick one chunk of work per turn, deliver it, ask for confirmation, move on.
- Explain "the why" briefly when introducing new concepts.
- Don't dump multiple milestones in one go.
- When the user reports the test flow works, commit, push, then move to M3.
- If something breaks: ask for the specific error message before guessing. Then fix one thing at a time.
- Tone matches the brand: direct, casual, slightly cheeky. No corporate-speak.

---

End of handover. Read this in full, then proceed with M2.
