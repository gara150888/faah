import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { createTournamentSchema, tournamentStatusSchema } from "~/schema/tournament.schema";
import { TournamentService } from "~/server/api/services/tournament.service";
import { ServiceError } from "~/server/api/services/service-error";

const toTRPCError = (error: unknown): never => {
  if (error instanceof ServiceError) {
    throw new TRPCError({
      code: error.code,
      message: error.message,
    });
  }
  throw error;
};

export const tournamentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createTournamentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await TournamentService.create(input, ctx.session.user.id);
      } catch (error) {
        toTRPCError(error);
      }
    }),

  getAll: publicProcedure
    .input(
      z
        .object({
          status: z.enum(["all", "upcoming", "ongoing", "completed", "cancelled"]).optional(),
          search: z.string().optional(),
          gameName: z.string().optional(),
          mode: z.enum(["all", "solo", "duo", "squad"]).optional(),
          sort: z.enum(["latest", "oldest"]).optional(),
          page: z.number().int().positive().optional(),
          limit: z.number().int().positive().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      return TournamentService.getAll(input ?? {});
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      try {
        return await TournamentService.getById(input.id);
      } catch (error) {
        toTRPCError(error);
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await TournamentService.delete(input.id, ctx.session.user.id);
      } catch (error) {
        toTRPCError(error);
      }
    }),
});
