CREATE TABLE IF NOT EXISTS "ironclad_api_key" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"key" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_used_at" timestamp,
	"archived_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ironclad_goal" (
	"id" serial PRIMARY KEY NOT NULL,
	"skill" "skill" NOT NULL,
	"progress" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"completed_at" timestamp,
	"archived_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ironclad_oldschool_account" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_hash" text NOT NULL,
	"character_name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"archived_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ironclad_progress_entry" (
	"id" serial PRIMARY KEY NOT NULL,
	"oldschool_account_id" text NOT NULL,
	"goal_id" serial NOT NULL,
	"entry" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"archived_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ironclad_verification_token" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "ironclad_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DROP TABLE "ironclad_verificationToken";