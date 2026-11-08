// Placeholder data used until Supabase is connected (roadmap Phase 3).
import type { Room, UserProfile } from "@/types";

export const currentUser: UserProfile = {
  id: "me",
  username: "you",
  animal: "cat",
  online: true,
};

export const onlineUsers: UserProfile[] = [
  currentUser,
  { id: "u2", username: "mori", animal: "bear", online: true },
  { id: "u3", username: "pip", animal: "penguin", online: true },
  { id: "u4", username: "hana", animal: "rabbit", online: true },
  { id: "u5", username: "spike", animal: "hedgehog", online: true },
];

export const rooms: Room[] = [
  {
    id: "morning-library",
    name: "Morning Library",
    description: "Quiet reading, cameras off, minds on.",
    visibility: "public",
    creatorId: "u2",
    creatorName: "mori",
    onlineCount: 4,
    createdAt: "2026-11-08T08:00:00Z",
    status: "quiet",
  },
  {
    id: "exam-week",
    name: "Exam Week Grind",
    description: "50/10 pomodoros until finals are over.",
    visibility: "public",
    creatorId: "u3",
    creatorName: "pip",
    onlineCount: 7,
    createdAt: "2026-11-07T14:30:00Z",
    status: "open",
  },
  {
    id: "night-owls",
    name: "Night Owls",
    description: "For people who work best after midnight.",
    visibility: "public",
    creatorId: "u5",
    creatorName: "spike",
    onlineCount: 2,
    createdAt: "2026-11-06T22:10:00Z",
    status: "open",
  },
  {
    id: "thesis-club",
    name: "Thesis Club",
    description: "Private room for our writing group.",
    visibility: "private",
    creatorId: "me",
    creatorName: "you",
    onlineCount: 1,
    createdAt: "2026-11-05T10:00:00Z",
    status: "open",
  },
];

export const publicRooms = rooms.filter((r) => r.visibility === "public");
export const privateRooms = rooms.filter((r) => r.visibility === "private");
export const myRooms = rooms.filter((r) => r.creatorId === currentUser.id);
