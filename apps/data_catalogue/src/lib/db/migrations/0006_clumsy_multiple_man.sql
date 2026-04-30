ALTER TABLE "users" ALTER COLUMN "groups" TYPE TEXT[] USING string_to_array(groups,'');
ALTER TABLE "users" ALTER COLUMN "groups" SET DATA TYPE text[];
