import { and, count, eq } from "drizzle-orm";

import type { CreateTeamInput } from "~/schema/tournament.schema";
import { db } from "~/server/db";
import { team, teamPlayer, tournament, user } from "~/server/db/schema";

import { ServiceError } from "./service-error";

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

type CreateTeamInputWithPassword = CreateTeamInput & {
  password?: string;
};

export class TeamService {
  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private static async getTournament(tx: Transaction, tournamentId: string) {
    const [result] = await tx
      .select()
      .from(tournament)
      .where(eq(tournament.id, tournamentId))
      .limit(1);

    if (!result) throw new ServiceError("Tournament not found", "NOT_FOUND");

    return result;
  }

  private static validateRegistration(tourney: typeof tournament.$inferSelect) {
    if (tourney.status !== "upcoming")
      throw new ServiceError(
        "Registration is only allowed for upcoming tournaments",
        "BAD_REQUEST",
      );

    const now = new Date();

    if (now < tourney.registrationStart || now > tourney.registrationEnd) {
      throw new ServiceError(
        "Registration is not currently open for this tournament",
        "BAD_REQUEST",
      );
    }
  }

  private static validateTournamentPassword(
    tourney: typeof tournament.$inferSelect,
    password?: string,
  ) {
    if (tourney.visibility !== "private") return;

    if (!password || tourney.password !== password)
      throw new ServiceError("Invalid tournament password", "FORBIDDEN");
  }

  private static async ensureUserNotInTournament(
    tx: Transaction,
    tournamentId: string,
    userId: string,
  ) {
    const [member] = await tx
      .select({ id: teamPlayer.id })
      .from(teamPlayer)
      .innerJoin(team, eq(teamPlayer.teamId, team.id))
      .where(
        and(eq(team.tournamentId, tournamentId), eq(teamPlayer.userId, userId)),
      )
      .limit(1);

    if (member)
      throw new ServiceError(
        "You are already registered in a team for this tournament",
        "BAD_REQUEST",
      );
  }

  private static async ensureTeamNameAvailable(
    tx: Transaction,
    tournamentId: string,
    teamName: string,
  ) {
    const [existingTeam] = await tx
      .select({ id: team.id })
      .from(team)
      .where(and(eq(team.tournamentId, tournamentId), eq(team.name, teamName)))
      .limit(1);

    if (existingTeam)
      throw new ServiceError(
        "A team with this name already exists in this tournament",
        "BAD_REQUEST",
      );
  }

  private static async ensureTournamentHasSpace(
    tx: Transaction,
    tourney: typeof tournament.$inferSelect,
  ) {
    const [result] = await tx
      .select({ count: count() })
      .from(team)
      .where(eq(team.tournamentId, tourney.id));

    if (result && result.count >= tourney.maxTeams) {
      throw new ServiceError("Tournament registration is full", "BAD_REQUEST");
    }
  }

  private static async getTeamWithTournament(tx: Transaction, teamId: string) {
    const [result] = await tx
      .select({
        team,
        tournament,
      })
      .from(team)
      .innerJoin(tournament, eq(team.tournamentId, tournament.id))
      .where(eq(team.id, teamId))
      .limit(1);

    if (!result) {
      throw new ServiceError("Team not found", "NOT_FOUND");
    }

    return result;
  }

  private static ensureCaptain(
    targetTeam: typeof team.$inferSelect,
    userId: string,
  ) {
    if (targetTeam.creatorId !== userId) {
      throw new ServiceError(
        "Only the captain can perform this action",
        "FORBIDDEN",
      );
    }
  }

  private static ensureRegistrationNotEnded(
    tourney: typeof tournament.$inferSelect,
  ) {
    if (new Date() > tourney.registrationEnd) {
      throw new ServiceError(
        "This action is no longer available because registration has ended",
        "BAD_REQUEST",
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Create Team
  // ---------------------------------------------------------------------------

  static async create(input: CreateTeamInputWithPassword, userId: string) {
    return db.transaction(async (tx) => {
      const tourney = await this.getTournament(tx, input.tournamentId);

      this.validateRegistration(tourney);

      this.validateTournamentPassword(tourney, input.password);

      await this.ensureTournamentHasSpace(tx, tourney);

      await this.ensureUserNotInTournament(tx, tourney.id, userId);

      await this.ensureTeamNameAvailable(tx, tourney.id, input.name);

      const [newTeam] = await tx
        .insert(team)
        .values({
          tournamentId: tourney.id,
          name: input.name,
          creatorId: userId,
          image: input.image ?? null,
        })
        .returning();

      if (!newTeam) {
        throw new ServiceError(
          "Failed to create team",
          "INTERNAL_SERVER_ERROR",
        );
      }

      await tx.insert(teamPlayer).values({
        teamId: newTeam.id,
        userId,
        role: "captain",
      });

      return newTeam;
    });
  }

  // ---------------------------------------------------------------------------
  // Join Team
  // ---------------------------------------------------------------------------

  static async join(
    input: {
      teamId: string;
      password?: string;
    },
    userId: string,
  ) {
    return db.transaction(async (tx) => {
      const { team: targetTeam, tournament: tourney } =
        await this.getTeamWithTournament(tx, input.teamId);

      this.validateRegistration(tourney);

      this.validateTournamentPassword(tourney, input.password);

      await this.ensureUserNotInTournament(tx, tourney.id, userId);

      const [playersResult] = await tx
        .select({ count: count() })
        .from(teamPlayer)
        .where(eq(teamPlayer.teamId, targetTeam.id));

      if (playersResult && playersResult.count >= tourney.teamSize) {
        throw new ServiceError("This team is already full", "BAD_REQUEST");
      }

      const [newPlayer] = await tx
        .insert(teamPlayer)
        .values({
          teamId: targetTeam.id,
          userId,
          role: "player",
        })
        .returning();

      if (!newPlayer) {
        throw new ServiceError("Failed to join team", "INTERNAL_SERVER_ERROR");
      }

      return newPlayer;
    });
  }

  // ---------------------------------------------------------------------------
  // Leave Team
  // ---------------------------------------------------------------------------

  static async leave(input: { teamId: string }, userId: string) {
    return db.transaction(async (tx) => {
      const [membership] = await tx
        .select({
          member: teamPlayer,
          team,
          tournament,
        })
        .from(teamPlayer)
        .innerJoin(team, eq(teamPlayer.teamId, team.id))
        .innerJoin(tournament, eq(team.tournamentId, tournament.id))
        .where(
          and(
            eq(teamPlayer.teamId, input.teamId),
            eq(teamPlayer.userId, userId),
          ),
        )
        .limit(1);

      if (!membership) {
        throw new ServiceError(
          "You are not a member of this team",
          "NOT_FOUND",
        );
      }

      const { member, tournament: tourney } = membership;

      this.ensureRegistrationNotEnded(tourney);

      if (member.role === "captain") {
        throw new ServiceError(
          "Captains cannot leave a team. Disband the team instead.",
          "BAD_REQUEST",
        );
      }

      await tx.delete(teamPlayer).where(eq(teamPlayer.id, member.id));

      return {
        success: true,
      };
    });
  }

  // ---------------------------------------------------------------------------
  // Disband Team
  // ---------------------------------------------------------------------------

  static async disband(input: { teamId: string }, userId: string) {
    return db.transaction(async (tx) => {
      const { team: targetTeam, tournament: tourney } =
        await this.getTeamWithTournament(tx, input.teamId);

      this.ensureCaptain(targetTeam, userId);

      this.ensureRegistrationNotEnded(tourney);

      await tx.delete(team).where(eq(team.id, targetTeam.id));

      return {
        success: true,
      };
    });
  }

  // ---------------------------------------------------------------------------
  // Kick Player
  // ---------------------------------------------------------------------------

  static async kick(
    input: {
      teamId: string;
      userId: string;
    },
    requesterId: string,
  ) {
    return db.transaction(async (tx) => {
      const { team: targetTeam, tournament: tourney } =
        await this.getTeamWithTournament(tx, input.teamId);

      this.ensureCaptain(targetTeam, requesterId);

      this.ensureRegistrationNotEnded(tourney);

      const [targetMember] = await tx
        .select()
        .from(teamPlayer)
        .where(
          and(
            eq(teamPlayer.teamId, targetTeam.id),
            eq(teamPlayer.userId, input.userId),
          ),
        )
        .limit(1);

      if (!targetMember) {
        throw new ServiceError(
          "Player is not a member of this team",
          "NOT_FOUND",
        );
      }

      if (targetMember.role === "captain") {
        throw new ServiceError("Cannot kick the captain", "BAD_REQUEST");
      }

      await tx.delete(teamPlayer).where(eq(teamPlayer.id, targetMember.id));

      return {
        success: true,
      };
    });
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  static async getTeamsByTournamentId(tournamentId: string) {
    return db.select().from(team).where(eq(team.tournamentId, tournamentId));
  }

  static async getTeamPlayers(teamId: string) {
    return db
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
      .where(eq(teamPlayer.teamId, teamId));
  }

  static async getMyTeamsByTournamentId(tournamentId: string, userId: string) {
    return db
      .select({
        id: team.id,
        name: team.name,
        image: team.image,
        createdAt: team.createdAt,
      })
      .from(team)
      .where(
        and(eq(team.tournamentId, tournamentId), eq(team.creatorId, userId)),
      );
  }
}
