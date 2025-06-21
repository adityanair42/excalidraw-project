import { z } from "zod";

export const CreaseUserSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string(),
  name: z.string()
})

export const SigninSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string()
})

export const CreateRoomSchema = z.object({
  room: z.string().min(3).max(20),
})