"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addWishlistItem(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = (formData.get("name") as string).trim();
  const description = (formData.get("description") as string)?.trim() || null;

  await supabase.from("wishlist").insert({ user_id: user.id, name, description });
  revalidatePath("/dashboard");
}

export async function deleteWishlistItem(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = formData.get("id") as string;
  await supabase
    .from("wishlist")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/dashboard");
}
