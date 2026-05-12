"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addSkill(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("skills").insert({
    user_id: user.id,
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || null,
    base_points: parseInt(formData.get("base_points") as string),
    deadline: formData.get("deadline") as string,
    status: "active",
  });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function updateSkill(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const skillId = formData.get("skillId") as string;

  const { error } = await supabase
    .from("skills")
    .update({
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
      base_points: parseInt(formData.get("base_points") as string),
      deadline: formData.get("deadline") as string,
    })
    .eq("id", skillId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function deleteSkill(skillId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("skills")
    .delete()
    .eq("id", skillId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function completeSkill(skillId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: skill, error: fetchError } = await supabase
    .from("skills")
    .select("base_points, deadline")
    .eq("id", skillId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !skill) throw new Error("Skill nicht gefunden");

  const today = new Date().toISOString().split("T")[0];
  const onTime = today <= skill.deadline;
  const pointsEarned = onTime
    ? skill.base_points
    : Math.floor(skill.base_points / 2);

  const { error } = await supabase
    .from("skills")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      points_earned: pointsEarned,
    })
    .eq("id", skillId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}
