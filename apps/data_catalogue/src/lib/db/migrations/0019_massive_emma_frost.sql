ALTER TABLE "configuration" RENAME COLUMN "downloads_storage" TO "resources_storage";--> statement-breakpoint
ALTER TABLE "configuration" DROP CONSTRAINT "configuration_downloads_storage_storages_id_fk";
--> statement-breakpoint
ALTER TABLE "configuration" ADD CONSTRAINT "configuration_resources_storage_storages_id_fk" FOREIGN KEY ("resources_storage") REFERENCES "public"."storages"("id") ON DELETE set null ON UPDATE no action;