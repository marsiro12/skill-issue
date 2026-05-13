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
      redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
  } catch (e) {
    unstable_rethrow(e);
    redirect(`/login?error=${encodeURIComponent("Verbindungsfehler. Bitte versuche es erneut.")}`);
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
