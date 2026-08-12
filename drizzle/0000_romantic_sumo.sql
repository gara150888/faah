CREATE TYPE "public"."team_player_role" AS ENUM('captain', 'player', 'substitute');--> statement-breakpoint
CREATE TYPE "public"."tournament_mode" AS ENUM('solo', 'duo', 'squad');--> statement-breakpoint
CREATE TYPE "public"."tournament_status" AS ENUM('upcoming', 'ongoing', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."tournament_visibility" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp with time zone,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tournament_id" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"creator_id" text NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "team_player" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" "team_player_role" DEFAULT 'player' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tournament" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organizer_id" text NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"game_name" varchar(100) NOT NULL,
	"mode" "tournament_mode" NOT NULL,
	"max_teams" integer NOT NULL,
	"max_players" integer NOT NULL,
	"team_size" integer NOT NULL,
	"visibility" "tournament_visibility" DEFAULT 'public' NOT NULL,
	"password" text,
	"status" "tournament_status" DEFAULT 'upcoming' NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"registration_start" timestamp with time zone NOT NULL,
	"registration_end" timestamp with time zone NOT NULL,
	"banner" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_tournament_id_tournament_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournament"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_player" ADD CONSTRAINT "team_player_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_player" ADD CONSTRAINT "team_player_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament" ADD CONSTRAINT "tournament_organizer_id_user_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "team_tournament_idx" ON "team" USING btree ("tournament_id");--> statement-breakpoint
CREATE INDEX "team_creator_idx" ON "team" USING btree ("creator_id");--> statement-breakpoint
CREATE UNIQUE INDEX "team_tournament_name_unique" ON "team" USING btree ("tournament_id","name");--> statement-breakpoint
CREATE INDEX "team_player_team_idx" ON "team_player" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "team_player_user_idx" ON "team_player" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "team_player_team_user_unique" ON "team_player" USING btree ("team_id","user_id");--> statement-breakpoint
CREATE INDEX "tournament_organizer_idx" ON "tournament" USING btree ("organizer_id");--> statement-breakpoint
CREATE INDEX "tournament_status_idx" ON "tournament" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tournament_mode_idx" ON "tournament" USING btree ("mode");--> statement-breakpoint
CREATE INDEX "tournament_visibility_idx" ON "tournament" USING btree ("visibility");