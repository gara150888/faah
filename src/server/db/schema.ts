import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTableCreator,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// --------------------------------------------------
// Table Creator
// --------------------------------------------------

export const createTable = pgTableCreator((name) => name);

// --------------------------------------------------
// Enums
// --------------------------------------------------

export const tournamentModeEnum = pgEnum("tournament_mode", [
  "solo",
  "duo",
  "squad",
]);

export const tournamentVisibilityEnum = pgEnum("tournament_visibility", [
  "public",
  "private",
]);

export const tournamentStatusEnum = pgEnum("tournament_status", [
  "upcoming",
  "ongoing",
  "completed",
  "cancelled",
]);

export const teamPlayerRoleEnum = pgEnum("team_player_role", [
  "captain",
  "player",
  "substitute",
]);

// --------------------------------------------------
// USER
// Better Auth user table
// --------------------------------------------------

export const user = createTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).$onUpdate(() => new Date()),
});

// --------------------------------------------------
// SESSION
// --------------------------------------------------

export const session = createTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).$onUpdate(() => new Date()),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),
  impersonatedBy: text("impersonated_by"),
});

// --------------------------------------------------
// ACCOUNT
// --------------------------------------------------

export const account = createTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).$onUpdate(() => new Date()),
});

// --------------------------------------------------
// VERIFICATION
// --------------------------------------------------

export const verification = createTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).$onUpdate(() => new Date()),
});

// ==================================================
// TOURNAMENT
// ==================================================

export const tournament = createTable(
  "tournament",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizerId: text("organizer_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "restrict",
      }),
    name: varchar("name", {
      length: 100,
    }).notNull(),
    description: text("description"),
    gameName: varchar("game_name", {
      length: 100,
    }).notNull(),
    mode: tournamentModeEnum("mode").notNull(),
    maxTeams: integer("max_teams").notNull(),
    maxPlayers: integer("max_players").notNull(),
    teamSize: integer("team_size").notNull(),
    visibility: tournamentVisibilityEnum("visibility")
      .notNull()
      .default("public"),
    password: text("password"),
    status: tournamentStatusEnum("status").notNull().default("upcoming"),
    startDate: timestamp("start_date", {
      withTimezone: true,
    }).notNull(),
    endDate: timestamp("end_date", {
      withTimezone: true,
    }).notNull(),
    registrationStart: timestamp("registration_start", {
      withTimezone: true,
    }).notNull(),
    registrationEnd: timestamp("registration_end", {
      withTimezone: true,
    }).notNull(),
    banner: text("banner"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    }).$onUpdate(() => new Date()),
  },

  (table) => ({
    organizerIdx: index("tournament_organizer_idx").on(table.organizerId),
    statusIdx: index("tournament_status_idx").on(table.status),
    modeIdx: index("tournament_mode_idx").on(table.mode),
    visibilityIdx: index("tournament_visibility_idx").on(table.visibility),
  }),
);

// ==================================================
// TEAM
// ==================================================

export const team = createTable(
  "team",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tournamentId: uuid("tournament_id")
      .notNull()
      .references(() => tournament.id, {
        onDelete: "cascade",
      }),
    name: varchar("name", {
      length: 50,
    }).notNull(),
    creatorId: text("creator_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "restrict",
      }),
    image: text("image"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    }).$onUpdate(() => new Date()),
  },

  (table) => ({
    tournamentIdx: index("team_tournament_idx").on(table.tournamentId),
    creatorIdx: index("team_creator_idx").on(table.creatorId),
    tournamentNameUnique: uniqueIndex("team_tournament_name_unique").on(
      table.tournamentId,
      table.name,
    ),
  }),
);

// ==================================================
// TEAM PLAYERS
// ==================================================

export const teamPlayer = createTable(
  "team_player",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => team.id, {
        onDelete: "cascade",
      }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),
    role: teamPlayerRoleEnum("role").notNull().default("player"),
    joinedAt: timestamp("joined_at", {
      withTimezone: true,
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    teamIdx: index("team_player_team_idx").on(table.teamId),
    userIdx: index("team_player_user_idx").on(table.userId),
    teamUserUnique: uniqueIndex("team_player_team_user_unique").on(
      table.teamId,
      table.userId,
    ),
  }),
);
