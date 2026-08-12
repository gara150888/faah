import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and, count, sql } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { team, teamPlayer, tournament, user } from "~/server/db/schema";
import { createTeamSchema } from "~/schema/tournament.schema";

export const teamRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      createTeamSchema.extend({
        password: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        // Fetch tournament
        const [tourney] = await tx
          .select()
          .from(tournament)
          .where(eq(tournament.id, input.tournamentId))
          .limit(1);

        if (!tourney) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Tournament not found",
          });
        }

        // Check status
        if (tourney.status !== "upcoming") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Registration is only allowed for upcoming tournaments",
          });
        }

        // Check registration period
        const now = new Date();
        if (now < tourney.registrationStart || now > tourney.registrationEnd) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Registration is not currently open for this tournament",
          });
        }

        // Check password if private
        if (tourney.visibility === "private") {
          if (!input.password || tourney.password !== input.password) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Invalid tournament password",
            });
          }
        }

        // Check maxTeams limit
        const [teamsCountResult] = await tx
          .select({ value: count() })
          .from(team)
          .where(eq(team.tournamentId, tourney.id));

        if (teamsCountResult && teamsCountResult.value >= tourney.maxTeams) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Tournament registration is full (maximum teams reached)",
          });
        }

        // Check if user is already registered in a team for this tournament
        const [existingMember] = await tx
          .select({ id: teamPlayer.id })
          .from(teamPlayer)
          .innerJoin(team, eq(teamPlayer.teamId, team.id))
          .where(
            and(
              eq(team.tournamentId, tourney.id),
              eq(teamPlayer.userId, ctx.session.user.id)
            )
          )
          .limit(1);

        if (existingMember) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You are already registered in a team for this tournament",
          });
        }

        // Check if team name is unique for this tournament
        const [existingTeamName] = await tx
          .select({ id: team.id })
          .from(team)
          .where(
            and(eq(team.tournamentId, tourney.id), eq(team.name, input.name))
          )
          .limit(1);

        if (existingTeamName) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "A team with this name already exists in this tournament",
          });
        }

        // Insert the team
        const [newTeam] = await tx
          .insert(team)
          .values({
            tournamentId: input.tournamentId,
            name: input.name,
            creatorId: ctx.session.user.id,
            image: input.image ?? null,
          })
          .returning();

        if (!newTeam) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create team",
          });
        }

        // Add creator as the captain
        await tx.insert(teamPlayer).values({
          teamId: newTeam.id,
          userId: ctx.session.user.id,
          role: "captain",
        });

        return newTeam;
      });
    }),

  join: protectedProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
        password: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        // Fetch team and associated tournament
        const teamRecords = await tx
          .select({
            team: team,
            tournament: tournament,
          })
          .from(team)
          .innerJoin(tournament, eq(team.tournamentId, tournament.id))
          .where(eq(team.id, input.teamId))
          .limit(1);

        const result = teamRecords[0];
        if (!result) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Team not found",
          });
        }

        const { team: targetTeam, tournament: tourney } = result;

        // Check tournament status
        if (tourney.status !== "upcoming") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Tournament has already started or is completed",
          });
        }

        // Check registration period
        const now = new Date();
        if (now < tourney.registrationStart || now > tourney.registrationEnd) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Registration is not open for this tournament",
          });
        }

        // Verify password if private
        if (tourney.visibility === "private") {
          if (!input.password || tourney.password !== input.password) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Invalid tournament password",
            });
          }
        }

        // Check team size limit
        const [playersCountResult] = await tx
          .select({ value: count() })
          .from(teamPlayer)
          .where(eq(teamPlayer.teamId, targetTeam.id));

        if (playersCountResult && playersCountResult.value >= tourney.teamSize) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This team is already full",
          });
        }

        // Check if user is already registered in any team for this tournament
        const [existingMember] = await tx
          .select({ id: teamPlayer.id })
          .from(teamPlayer)
          .innerJoin(team, eq(teamPlayer.teamId, team.id))
          .where(
            and(
              eq(team.tournamentId, tourney.id),
              eq(teamPlayer.userId, ctx.session.user.id)
            )
          )
          .limit(1);

        if (existingMember) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You are already registered in a team for this tournament",
          });
        }

        // Insert user as player
        const [newPlayer] = await tx
          .insert(teamPlayer)
          .values({
            teamId: targetTeam.id,
            userId: ctx.session.user.id,
            role: "player",
          })
          .returning();

        return newPlayer;
      });
    }),

  leave: protectedProcedure
    .input(z.object({ teamId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        // Fetch current member record and tournament
        const records = await tx
          .select({
            teamPlayer: teamPlayer,
            tournament: tournament,
          })
          .from(teamPlayer)
          .innerJoin(team, eq(teamPlayer.teamId, team.id))
          .innerJoin(tournament, eq(team.tournamentId, tournament.id))
          .where(
            and(
              eq(teamPlayer.teamId, input.teamId),
              eq(teamPlayer.userId, ctx.session.user.id)
            )
          )
          .limit(1);

        const record = records[0];
        if (!record) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "You are not a member of this team",
          });
        }

        const { teamPlayer: member, tournament: tourney } = record;

        // Check registration period
        const now = new Date();
        if (now > tourney.registrationEnd) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot leave a team after registration has ended",
          });
        }

        // Captain cannot leave directly
        if (member.role === "captain") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Captains cannot leave a team. Disband the team instead.",
          });
        }

        await tx.delete(teamPlayer).where(eq(teamPlayer.id, member.id));

        return { success: true };
      });
    }),

  disband: protectedProcedure
    .input(z.object({ teamId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const records = await tx
          .select({
            team: team,
            tournament: tournament,
          })
          .from(team)
          .innerJoin(tournament, eq(team.tournamentId, tournament.id))
          .where(eq(team.id, input.teamId))
          .limit(1);

        const record = records[0];
        if (!record) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Team not found",
          });
        }

        const { team: targetTeam, tournament: tourney } = record;

        // Check if creator
        if (targetTeam.creatorId !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only the captain can disband the team",
          });
        }

        // Check registration period
        const now = new Date();
        if (now > tourney.registrationEnd) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot disband a team after registration has ended",
          });
        }

        // Delete the team (cascading deletes will remove the player records)
        await tx.delete(team).where(eq(team.id, targetTeam.id));

        return { success: true };
      });
    }),

  kick: protectedProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const records = await tx
          .select({
            team: team,
            tournament: tournament,
          })
          .from(team)
          .innerJoin(tournament, eq(team.tournamentId, tournament.id))
          .where(eq(team.id, input.teamId))
          .limit(1);

        const record = records[0];
        if (!record) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Team not found",
          });
        }

        const { team: targetTeam, tournament: tourney } = record;

        // Check if captain
        if (targetTeam.creatorId !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only the captain can kick players",
          });
        }

        // Check registration period
        const now = new Date();
        if (now > tourney.registrationEnd) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot kick players after registration has ended",
          });
        }

        // Check target member
        const [targetMember] = await tx
          .select()
          .from(teamPlayer)
          .where(
            and(
              eq(teamPlayer.teamId, targetTeam.id),
              eq(teamPlayer.userId, input.userId)
            )
          )
          .limit(1);

        if (!targetMember) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Player is not a member of this team",
          });
        }

        if (targetMember.role === "captain") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot kick the captain",
          });
        }

        await tx.delete(teamPlayer).where(eq(teamPlayer.id, targetMember.id));

        return { success: true };
      });
    }),

  getTeamsByTournamentId: publicProcedure
    .input(z.object({ tournamentId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(team)
        .where(eq(team.tournamentId, input.tournamentId));
    }),

  getTeamPlayers: publicProcedure
    .input(z.object({ teamId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select({
          id: teamPlayer.id,
          userId: teamPlayer.userId,
          role: teamPlayer.role,
          joinedAt: teamPlayer.joinedAt,
          name: user.name,
          image: user.image,
        })
        .from(teamPlayer)
        .innerJoin(user, eq(teamPlayer.userId, user.id))
        .where(eq(teamPlayer.teamId, input.teamId));
    }),
});
