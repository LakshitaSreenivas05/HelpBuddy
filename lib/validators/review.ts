import { z } from "zod";

export const createReviewSchema = z.object({
  bookingId: z.string().min(1, "Booking id is required"),
  rating: z
    .coerce
    .number({ invalid_type_error: "Rating must be a number" })
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be more than 5"),
  comment: z
    .string()
    .max(600, "Review comment must be 600 characters or less")
    .optional()
    .or(z.literal("")),
});

