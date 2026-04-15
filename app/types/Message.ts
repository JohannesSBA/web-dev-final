import { ObjectId } from "mongodb";

export interface MessageType {
  _id: ObjectId;
  message: string;
  userId: string;
  userName?: string;
  groupId: string;
  createdAt: Date;
}

export interface UserType {
  _id: ObjectId;
  name: string;
  email: string;
  image: string;
}
