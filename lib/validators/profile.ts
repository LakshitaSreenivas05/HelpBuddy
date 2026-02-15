import { z } from "zod";

export const profileUpdateSchema = z
  .object({
    displayName: z
      .string()
      .min(2, "Display name should be at least 2 characters")
      .max(80, "Display name should be shorter than 80 characters")
      .optional(),
    bio: z
      .string()
      .max(600, "Bio must be 600 characters or less")
      .optional()
      .or(z.literal("")),
    location: z.string().max(120).optional().or(z.literal("")),
    phone: z
      .string()
      .regex(/^[+()\d\s-]{7,}$/u, "Please provide a valid phone number")
      .optional()
      .or(z.literal("")),
    skills: z.array(z.string().min(2).max(40)).max(20).optional(),
    languages: z.array(z.string().min(2).max(40)).max(10).optional(),
    avatarUrl: z.string().url("Please provide a valid URL").optional().or(z.literal("")),
    services: z.array(z.string().min(2).max(60)).max(20).optional(),
    hourlyRate: z
      .number({ invalid_type_error: "Hourly rate must be a number" })
      .nonnegative()
      .max(10000)
      .optional(),
    yearsOfExperience: z.number().min(0).max(60).optional(),
    headline: z.string().max(120).optional().or(z.literal("")),
    travelRadiusKm: z.number().min(0).max(500).optional(),
  })
  .partial();

