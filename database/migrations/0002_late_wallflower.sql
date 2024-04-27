ALTER TABLE "ironclad_goal" ADD COLUMN "channel_id" text;--> statement-breakpoint
ALTER TABLE "ironclad_goal" ADD COLUMN "message_id" text;--> statement-breakpoint
ALTER TABLE "ironclad_goal" ADD CONSTRAINT "idx_channel_id_message_id" UNIQUE("channel_id","message_id");