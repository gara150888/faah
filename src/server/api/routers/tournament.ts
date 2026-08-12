import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and, ilike } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { tournament } from "~/server/db/schema";
import { createTournamentSchema, modeRules, tournamentStatusSchema } from "~/schema/tournament.schema";

export const tournamentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createTournamentSchema)
    .mutation(async ({ ctx, input }) => {
      const rules = modeRules[input.mode];
      
      const [newTournament] = await ctx.db
        .insert(tournament)
        .values({
          organizerId: ctx.session.user.id,
          name: input.name,
          description: input.description ?? null,
          gameName: input.gameName,
          mode: input.mode,
          maxTeams: rules.maxTeams,
          maxPlayers: rules.maxPlayers,
          teamSize: rules.teamSize,
          visibility: input.visibility,
          password: input.password ?? null,
          status: input.status,
          startDate: input.startDate,
          endDate: input.endDate,
          registrationStart: input.registrationStart,
          registrationEnd: input.registrationEnd,
          banner: input.banner ?? null,
        })
        .returning();

      if (!newTournament) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create tournament",
        });
      }

      return newTournament;
    }),

  getAll: publicProcedure
    .input(
      z
        .object({
          status: tournamentStatusSchema.optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const conditions = [];

      if (input?.status) {
        conditions.push(eq(tournament.status, input.status));
      }

      if (input?.search) {
        conditions.push(ilike(tournament.name, `%${input.search}%`));
      }

      const results = await ctx.db
        .select()
        .from(tournament)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      // Return tournaments but strip the password field for security
      // Instead, return a boolean flag indicating if it's password protected.
      return results.map(({ password, ...t }) => ({
        ...t,
        hasPassword: !!password,
      }));
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [found] = await ctx.db
        .select()
        .from(tournament)
        .where(eq(tournament.id, input.id))
        .limit(1);

      if (!found) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tournament not found",
        });
      }

      const { password, ...t } = found;
      return {
        ...t,
        hasPassword: !!password,
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [existing] = await ctx.db
        .select()
        .from(tournament)
        .where(eq(tournament.id, input.id))
        .limit(1);

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tournament not found",
        });
      }

      if (existing.organizerId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not the organizer of this tournament",
        });
      }

      await ctx.db.delete(tournament).where(eq(tournament.id, input.id));

      return { success: true };
    }),
});
