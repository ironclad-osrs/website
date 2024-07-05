CREATE TABLE IF NOT EXISTS "ironclad_account_kills" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_id" serial NOT NULL,
	"npc_id" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "ironclad_account_kills_account_id_npc_id_unique" UNIQUE("account_id","npc_id")
);
