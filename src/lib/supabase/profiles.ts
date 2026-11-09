import type { AnimalType, UserProfile } from "@/types";
import { supabase } from "./client";

interface ProfileRow {
  id: string;
  username: string;
  animal: AnimalType;
}

const toProfile = (r: ProfileRow): UserProfile => ({ id: r.id, username: r.username, animal: r.animal, online: true });

export async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase().from("profiles").select("id, username, animal").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data ? toProfile(data as ProfileRow) : null;
}

export async function saveProfile(userId: string, fields: { username: string; animal: AnimalType }): Promise<UserProfile> {
  const { data, error } = await supabase()
    .from("profiles")
    .upsert({ id: userId, username: fields.username.trim(), animal: fields.animal })
    .select("id, username, animal")
    .single();
  if (error) throw error;
  return toProfile(data as ProfileRow);
}
