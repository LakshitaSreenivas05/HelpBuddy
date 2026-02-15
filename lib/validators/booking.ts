import { z } from "zod";

export const createBookingSchema = z.object({
  helperId: z.string().min(1, "Helper id is required"),
  title: z
    .string()
    .min(3, "Please provide a short title for the booking")
    .max(120, "Title must be 120 characters or less"),
  description: z
    .string()
    .max(800, "Description should be 800 characters or less")
    .optional()
    .or(z.literal("")),
  scheduledAt: z
    .string()
    .datetime({ message: "Please provide a valid date and time" }),
  durationMinutes: z
    .coerce
    .number({ invalid_type_error: "Duration must be a number" })
    .int()
    .positive("Duration must be positive")
    .max(24 * 60, "Duration cannot exceed 24 hours")
    .optional(),
  location: z
    .string()
    .max(160, "Location description must be 160 characters or less")
    .optional()
    .or(z.literal("")),
  price: z
    .coerce
    .number({ invalid_type_error: "Price must be a number" })
    .nonnegative("Price cannot be negative")
    .max(100_000, "Price is too high")
    .optional(),
  notes: z.string().max(400).optional().or(z.literal("")),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "COMPLETED", "CANCELLED", "DECLINED"]),
  note: z
    .string()
    .max(400, "Notes must be 400 characters or less")
    .optional()
    .or(z.literal("")),
});

