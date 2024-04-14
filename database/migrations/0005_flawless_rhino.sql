CREATE TABLE IF NOT EXISTS "ironclad_skill" (
	"id" serial NOT NULL,
	"skill" "skill" NOT NULL,
	"xp" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
