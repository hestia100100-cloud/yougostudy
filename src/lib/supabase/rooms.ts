import type { Room } from "@/types";
import { supabase } from "./client";

interface RoomRow {
  id: string;
  name: string;
  description: string;
  visibility: Room["visibility"];
  creator_id: string | null;
  created_at: string;
  creator: { username: string } | null;
}

const SELECT = "id, name, description, visibility, creator_id, created_at, creator:profiles(username)";

/** Online count & status are live data, filled in from lobby presence by the caller. */
const toRoom = (r: RoomRow): Room => ({
  id: r.id,
  name: r.name,
  description: r.description,
  visibility: r.visibility,
  creatorId: r.creator_id,
  creatorName: r.creator?.username ?? "yougostudy",
  onlineCount: 0,
  createdAt: r.created_at,
  status: "quiet",
});

export async function listPublicRooms(): Promise<Room[]> {
  const { data, error } = await supabase()
    .from("rooms")
    .select(SELECT)
    .eq("visibility", "public")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as unknown as RoomRow[]).map(toRoom);
}

export async function listRoomsCreatedBy(userId: string): Promise<Room[]> {
  const { data, error } = await supabase().from("rooms").select(SELECT).eq("creator_id", userId).order("created_at", { ascending: false });
  if (error) throw error;
  return (data as unknown as RoomRow[]).map(toRoom);
}

export async function getRoom(id: string): Promise<Room | null> {
  // Room ids are UUIDs; anything else can't exist (and would make Postgres error).
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data, error } = await supabase().from("rooms").select(SELECT).eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toRoom(data as unknown as RoomRow) : null;
}

export async function createPublicRoom(fields: { name: string; description: string }): Promise<Room> {
  const { data, error } = await supabase()
    .from("rooms")
    .insert({ name: fields.name.trim(), description: fields.description.trim(), visibility: "public" })
    .select(SELECT)
    .single();
  if (error) throw error;
  return toRoom(data as unknown as RoomRow);
}
