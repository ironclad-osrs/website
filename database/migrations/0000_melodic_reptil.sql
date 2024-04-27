DO $$ BEGIN
 CREATE TYPE "skill" AS ENUM('attack', 'strength', 'defence', 'ranged', 'prayer', 'magic', 'runecraft', 'hitpoints', 'crafting', 'mining', 'smithing', 'fishing', 'cooking', 'firemaking', 'woodcutting', 'agility', 'herblore', 'thieving', 'fletching', 'slayer', 'farming', 'construction', 'hunter');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ironclad_api_key" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"key" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_used_at" timestamp,
	"archived_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ironclad_goal" (
	"id" serial PRIMARY KEY NOT NULL,
	"skill" "skill" NOT NULL,
	"progress" integer DEFAULT 0,
	"goal" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"completed_at" timestamp,
	"archived_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ironclad_account" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"account_hash" text NOT NULL,
	"character_name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"archived_at" timestamp,
	CONSTRAINT "ironclad_account_user_id_account_hash_unique" UNIQUE("user_id","account_hash")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ironclad_progress_entry" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_id" serial NOT NULL,
	"goal_id" serial NOT NULL,
	"entry" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"archived_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ironclad_skill" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_id" serial NOT NULL,
	"skill" "skill" NOT NULL,
	"xp" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "ironclad_skill_account_id_skill_unique" UNIQUE("account_id","skill")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ironclad_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"discord_user_id" text NOT NULL,
	"discord_guild_id" text NOT NULL,
	"discord_nickname" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "ironclad_user_discord_user_id_discord_guild_id_unique" UNIQUE("discord_user_id","discord_guild_id")
);
