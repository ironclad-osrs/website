DO $$ BEGIN
 CREATE TYPE "skill" AS ENUM('attack', 'strength', 'defence', 'ranged', 'prayer', 'magic', 'runecraft', 'hitpoints', 'crafting', 'mining', 'smithing', 'fishing', 'cooking', 'firemaking', 'woodcutting', 'agility', 'herblore', 'thieving', 'fletching', 'slayer', 'farming', 'construction', 'hunter');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
