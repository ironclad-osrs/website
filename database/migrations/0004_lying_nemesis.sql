CREATE TABLE IF NOT EXISTS "ironclad_account_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_id" serial NOT NULL,
	"item_id" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "ironclad_account_item_account_id_item_id_unique" UNIQUE("account_id","item_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ironclad_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "ironclad_item_item_id_unique" UNIQUE("item_id")
);
--> statement-breakpoint
ALTER TABLE "ironclad_skill" RENAME TO "ironclad_account_skill";--> statement-breakpoint
ALTER TABLE "ironclad_account_skill" DROP CONSTRAINT "ironclad_skill_account_id_skill_unique";--> statement-breakpoint
ALTER TABLE "ironclad_account_skill" ADD CONSTRAINT "ironclad_account_skill_account_id_skill_unique" UNIQUE("account_id","skill");