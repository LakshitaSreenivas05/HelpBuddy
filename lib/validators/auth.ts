import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name should be at least 2 characters long")
    .max(80, "Name should be shorter than 80 characters"),
  email: z.string().email("Please provide a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
  role: z.enum(["REQUESTER", "HELPER"]),
});

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

