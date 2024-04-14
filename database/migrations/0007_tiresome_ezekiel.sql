ALTER TABLE "ironclad_skill" DROP CONSTRAINT "ironclad_skill_id_skill_unique";--> statement-breakpoint
ALTER TABLE "ironclad_skill" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "ironclad_skill" ADD COLUMN "oldschool_account_id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "ironclad_skill" ADD CONSTRAINT "ironclad_skill_oldschool_account_id_skill_unique" UNIQUE("oldschool_account_id","skill");