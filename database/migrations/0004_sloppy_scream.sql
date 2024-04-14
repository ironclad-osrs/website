ALTER TABLE "ironclad_goal" ALTER COLUMN "progress" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "ironclad_goal" ALTER COLUMN "progress" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "ironclad_goal" ADD COLUMN "goal" integer NOT NULL;