import { z } from "zod";

export const tournamentModeSchema = z.enum(["solo", "duo", "squad"]);
export const tournamentVisibilitySchema = z.enum(["public", "private"]);

export const tournamentStatusSchema = z.enum([
  "upcoming",
  "ongoing",
  "completed",
  "cancelled",
]);

export const modeRules = {
  solo: { teamSize: 1, maxTeams: 50, maxPlayers: 50 },
  duo: { teamSize: 2, maxTeams: 25, maxPlayers: 50 },
  squad: { teamSize: 4, maxTeams: 12, maxPlayers: 48 },
} as const;

export const createTournamentSchema = z
  .object({
    name: z.string().trim().min(3).max(100),

    description: z.string().trim().max(500).optional(),

    gameName: z.string().trim().min(1).max(100),

    mode: tournamentModeSchema,

    visibility: tournamentVisibilitySchema,

    // Empty string => undefined
    password: z
      .string()
      .trim()
      .min(4, "Password must be at least 4 characters")
      .max(100)
      .optional()
      .or(z.literal("")),

    registrationStart: z.coerce.date(),
    registrationEnd: z.coerce.date(),

    startDate: z.coerce.date(),
    endDate: z.coerce.date(),

    status: tournamentStatusSchema.default("upcoming"),

    banner: z.string().url("Invalid banner URL").optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    // Private → password required
    if (data.visibility === "private" && !data.password) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password is required for private tournaments",
      });
    }

    // Public → password shouldn't exist
    if (data.visibility === "public" && data.password) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Public tournaments cannot have a password",
      });
    }

    if (data.registrationEnd <= data.registrationStart) {
      ctx.addIssue({
        code: "custom",
        path: ["registrationEnd"],
        message: "Registration must end after it starts",
      });
    }

    if (data.endDate <= data.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Tournament must end after it starts",
      });
    }

    if (data.registrationEnd > data.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["registrationEnd"],
        message: "Registration must end before tournament starts",
      });
    }
  });

export type CreateTournamentInput = z.infer<typeof createTournamentSchema>;

export const createTeamSchema = z.object({
  tournamentId: z.string().uuid("Invalid tournament ID"),
  name: z
    .string()
    .trim()
    .min(2, "Team name must be at least 2 characters")
    .max(50, "Team name cannot exceed 50 characters"),
  image: z.string().url("Invalid team image URL").optional().or(z.literal("")),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
