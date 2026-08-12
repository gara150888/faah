import { eq, and, ilike } from "drizzle-orm";

import type { CreateTournamentInput } from "~/schema/tournament.schema";
import { db } from "~/server/db";
import { tournament } from "~/server/db/schema";

import { ServiceError } from "./service-error";

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

const MODE_RULES = {
  solo: { teamSize: 1, maxTeams: 50, maxPlayers: 50 },
  duo: { teamSize: 2, maxTeams: 25, maxPlayers: 50 },
  squad: { teamSize: 4, maxTeams: 12, maxPlayers: 48 },
} as const;

export class TournamentService {
  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private static getModeRules(
    mode: "solo" | "duo" | "squad",
  ) {
    return MODE_RULES[mode];
  }

  private static async getTournament(
    tx: Transaction,
    tournamentId: string,
  ) {
    const [result] = await tx
      .select()
      .from(tournament)
      .where(eq(tournament.id, tournamentId))
      .limit(1);

    if (!result) {
      throw new ServiceError("Tournament not found", "NOT_FOUND");
    }

    return result;
  }

  private static ensureOrganizer(
    tourney: typeof tournament.$inferSelect,
    organizerId: string,
  ) {
    if (tourney.organizerId !== organizerId) {
      throw new ServiceError(
        "You are not the organizer of this tournament",
        "FORBIDDEN",
      );
    }
  }

  private static stripPassword<
    T extends typeof tournament.$inferSelect,
  >(row: T) {
    const { password, ...rest } = row;
    return {
      ...rest,
      hasPassword: !!password,
    };
  }

  // ---------------------------------------------------------------------------
  // Create Tournament
  // ---------------------------------------------------------------------------

  static async create(
    input: CreateTournamentInput,
    organizerId: string,
  ) {
    const rules = this.getModeRules(input.mode);

    const [newTournament] = await db
      .insert(tournament)
      .values({
        organizerId,
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
      throw new ServiceError(
        "Failed to create tournament",
        "INTERNAL_SERVER_ERROR",
      );
    }

    return newTournament;
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  static async getAll(filters?: {
    status?: "upcoming" | "ongoing" | "completed" | "cancelled";
    search?: string;
  }) {
    const conditions = [];

    if (filters?.status) {
      conditions.push(eq(tournament.status, filters.status));
    }

    if (filters?.search) {
      conditions.push(ilike(tournament.name, `%${filters.search}%`));
    }

    const results = await db
      .select()
      .from(tournament)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return results.map((row) => this.stripPassword(row));
  }

  static async getById(id: string) {
    const [found] = await db
      .select()
      .from(tournament)
      .where(eq(tournament.id, id))
      .limit(1);

    if (!found) {
      throw new ServiceError("Tournament not found", "NOT_FOUND");
    }

    return this.stripPassword(found);
  }

  // ---------------------------------------------------------------------------
  // Delete Tournament
  // ---------------------------------------------------------------------------

  static async delete(id: string, organizerId: string) {
    const [existing] = await db
      .select()
      .from(tournament)
      .where(eq(tournament.id, id))
      .limit(1);

    if (!existing) {
      throw new ServiceError("Tournament not found", "NOT_FOUND");
    }

    this.ensureOrganizer(existing, organizerId);

    await db.delete(tournament).where(eq(tournament.id, id));

    return { success: true };
  }
}
