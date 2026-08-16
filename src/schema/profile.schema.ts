import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(20, "Name cannot exceed 20 characters"),
  bio: z
    .string()
    .trim()
    .max(500, "Bio cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
  avatar: z
    .string()
    .url("Invalid avatar URL")
    .optional()
    .or(z.literal("")),
  banner: z
    .string()
    .url("Invalid banner URL")
    .optional()
    .or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
