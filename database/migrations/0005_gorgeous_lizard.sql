CREATE TABLE IF NOT EXISTS "ironclad_npc" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "ironclad_npc_item_id_unique" UNIQUE("item_id")
);
