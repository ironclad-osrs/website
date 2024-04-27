ALTER TABLE "ironclad_goal" ADD COLUMN "uuid" uuid DEFAULT gen_random_uuid();--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uuid" ON "ironclad_goal" ("uuid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_skill" ON "ironclad_goal" ("skill");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_completed_at_archived_at" ON "ironclad_goal" ("completed_at","archived_at");