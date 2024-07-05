ALTER TABLE "ironclad_npc" RENAME COLUMN "item_id" TO "npc_id";--> statement-breakpoint
ALTER TABLE "ironclad_npc" DROP CONSTRAINT "ironclad_npc_item_id_unique";--> statement-breakpoint
ALTER TABLE "ironclad_npc" ADD CONSTRAINT "ironclad_npc_npc_id_unique" UNIQUE("npc_id");