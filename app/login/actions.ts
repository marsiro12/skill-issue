"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    if (error) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "MISSING";
      redirect(`/login?error=${encodeURIComponent(`[${url.slice(0, 40)}] ${error.message}`)}`);
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
  } catch (e) {
    unstable_rethrow(e);
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "MISSING";
    const msg = e instanceof Error ? e.message : String(e);
    redirect(`/login?error=${encodeURIComponent(`[${url.slice(0, 30)}] ${msg}`)}`);
  }
}

export async function signup(formData: FormData) {
  try {
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
  } catch (e) {
    unstable_rethrow(e);
    redirect(`/signup?error=${encodeURIComponent("Verbindungsfehler. Bitte versuche es erneut.")}`);
  }
}
