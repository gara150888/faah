import { eq, and, ilike, or, desc, asc, sql } from "drizzle-orm";

import type { CreateTournamentInput } from "~/schema/tournament.schema";
import { db } from "~/server/db";
import { tournament, team } from "~/server/db/schema";

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

  private static getModeRules(mode: "solo" | "duo" | "squad") {
    return MODE_RULES[mode];
  }

  private static async getTournament(tx: Transaction, tournamentId: string) {
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

  private static stripPassword<T extends typeof tournament.$inferSelect>(row: T) {
    const { password, ...rest } = row;
    return {
      ...rest,
      hasPassword: !!password,
    };
  }

  // ---------------------------------------------------------------------------
  // Create Tournament
  // ---------------------------------------------------------------------------

  static async create(input: CreateTournamentInput, organizerId: string) {
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

  static async getAll(
    filters: {
      status?: "all" | "upcoming" | "ongoing" | "completed" | "cancelled";
      search?: string;
      gameName?: string;
      mode?: "all" | "solo" | "duo" | "squad";
      sort?: "latest" | "oldest";
      page?: number;
      limit?: number;
    } = {},
  ) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 6;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (filters.status && filters.status !== "all") {
      conditions.push(eq(tournament.status, filters.status));
    }

    if (filters.mode && filters.mode !== "all") {
      conditions.push(eq(tournament.mode, filters.mode));
    }

    if (filters.gameName && filters.gameName !== "all") {
      let gameSearch = filters.gameName;
      if (gameSearch === "bgmi") gameSearch = "BGMI";
      if (gameSearch === "freefire") gameSearch = "Free Fire";
      if (gameSearch === "cod") gameSearch = "COD Mobile";
      conditions.push(ilike(tournament.gameName, `%${gameSearch}%`));
    }

    if (filters.search) {
      conditions.push(
        or(
          ilike(tournament.name, `%${filters.search}%`),
          ilike(tournament.gameName, `%${filters.search}%`),
        ),
      );
    }

    // Count query for pagination totals
    const [countResult] = await db
      .select({
        count: sql<number>`cast(count(${tournament.id}) as integer)`,
      })
      .from(tournament)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const total = countResult?.count ?? 0;
    const totalPages = Math.ceil(total / limit);

    // Fetch tournaments with left join to get team count
    const results = await db
      .select({
        id: tournament.id,
        organizerId: tournament.organizerId,
        name: tournament.name,
        description: tournament.description,
        gameName: tournament.gameName,
        mode: tournament.mode,
        maxTeams: tournament.maxTeams,
        maxPlayers: tournament.maxPlayers,
        teamSize: tournament.teamSize,
        visibility: tournament.visibility,
        password: tournament.password,
        status: tournament.status,
        startDate: tournament.startDate,
        endDate: tournament.endDate,
        registrationStart: tournament.registrationStart,
        registrationEnd: tournament.registrationEnd,
        banner: tournament.banner,
        createdAt: tournament.createdAt,
        updatedAt: tournament.updatedAt,
        teamsCount: sql<number>`cast(count(${team.id}) as integer)`,
      })
      .from(tournament)
      .leftJoin(team, eq(team.tournamentId, tournament.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(tournament.id)
      .orderBy(
        filters.sort === "oldest"
          ? asc(tournament.createdAt)
          : desc(tournament.createdAt),
      )
      .limit(limit)
      .offset(offset);

    const tournaments = results.map((row) => {
      const { password, ...rest } = row;
      return {
        ...rest,
        hasPassword: !!password,
      };
    });

    return {
      tournaments,
      total,
      totalPages,
      page,
      limit,
    };
  }

  static async getById(id: string) {
    const [found] = await db
      .select()
      .from(tournament)
      .where(eq(tournament.id, id))
      .limit(1);

    if (!found) { throw new ServiceError("Tournament not found", "NOT_FOUND"); }

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

    if (!existing) { throw new ServiceError("Tournament not found", "NOT_FOUND"); }

    this.ensureOrganizer(existing, organizerId);

    await db.delete(tournament).where(eq(tournament.id, id));

    return { success: true };
  }
}
