export type AnimalType = "cat" | "rabbit" | "penguin" | "bear" | "hedgehog";

export type CharacterState =
  | "idle"
  | "walking"
  | "sitting"
  | "reading"
  | "working"
  | "sleeping"
  | "break";

export type RoomVisibility = "public" | "private";

export type RoomStatus = "open" | "quiet" | "closed";

export interface UserProfile {
  id: string;
  username: string;
  animal: AnimalType;
  online: boolean;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  visibility: RoomVisibility;
  creatorId: string;
  creatorName: string;
  onlineCount: number;
  createdAt: string;
  status: RoomStatus;
}

export interface ChatMessage {
  id: string;
  senderId: string | null; // null = system notification
  senderName: string;
  senderAnimal?: AnimalType;
  text: string;
  sentAt: string;
}
