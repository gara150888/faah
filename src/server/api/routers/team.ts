import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { createTeamSchema } from "~/schema/tournament.schema";
import { TeamService } from "~/server/api/services/team.service";
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

export const teamRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      createTeamSchema.extend({
        password: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await TeamService.create(input, ctx.session.user.id);
      } catch (error) {
        toTRPCError(error);
      }
    }),

  join: protectedProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
        password: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await TeamService.join(input, ctx.session.user.id);
      } catch (error) {
        toTRPCError(error);
      }
    }),

  leave: protectedProcedure
    .input(z.object({ teamId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await TeamService.leave(input, ctx.session.user.id);
      } catch (error) {
        toTRPCError(error);
      }
    }),

  disband: protectedProcedure
    .input(z.object({ teamId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await TeamService.disband(input, ctx.session.user.id);
      } catch (error) {
        toTRPCError(error);
      }
    }),

  kick: protectedProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await TeamService.kick(input, ctx.session.user.id);
      } catch (error) {
        toTRPCError(error);
      }
    }),

  getTeamsByTournamentId: publicProcedure
    .input(z.object({ tournamentId: z.string().uuid() }))
    .query(async ({ input }) => {
      return TeamService.getTeamsByTournamentId(input.tournamentId);
    }),

  getTeamPlayers: publicProcedure
    .input(z.object({ teamId: z.string().uuid() }))
    .query(async ({ input }) => {
      return TeamService.getTeamPlayers(input.teamId);
    }),

  getMyTeamsByTournamentId: protectedProcedure
    .input(z.object({ tournamentId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return TeamService.getMyTeamsByTournamentId(input.tournamentId, ctx.session.user.id);
    }),

  getTournamentTeamsWithDetails: publicProcedure
    .input(z.object({ tournamentId: z.string().uuid() }))
    .query(async ({ input }) => {
      return TeamService.getTournamentTeamsWithDetails(input.tournamentId);
    }),
});
