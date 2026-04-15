import { ObjectId } from "mongodb";

/** Serialized chat row for Client Components and Pusher (matches group page + send). */
export interface MessageType {
  id: string;
  /** Present on new rows; older DB docs may omit. */
  messageId?: string;
  message: string;
  userId: string;
  userName?: string;
  groupId: string;
  createdAt: string;
}

export interface UserType {
  _id: ObjectId;
  name: string;
  email: string;
  image: string;
}
