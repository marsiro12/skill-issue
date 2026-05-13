"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function followUser(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const username = (formData.get("username") as string).trim().toLowerCase();

  const { data: target } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single();

  if (!target) {
    redirect(
      "/dashboard?friendError=" + encodeURIComponent("Username nicht gefunden.")
    );
  }

  if (target.id === user.id) {
    redirect(
      "/dashboard?friendError=" +
        encodeURIComponent("Du kannst dir nicht selbst folgen.")
    );
  }

  const { error } = await supabase.from("follows").insert({
    follower_id: user.id,
    following_id: target.id,
  });

  if (error && error.code !== "23505") {
    redirect(
      "/dashboard?friendError=" + encodeURIComponent(error.message)
    );
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function unfollowUser(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const followingId = formData.get("followingId") as string;

  await supabase
    .from("follows")
    .delete()
    .eq("follower_id", user.id)
    .eq("following_id", followingId);

  revalidatePath("/dashboard");
}
