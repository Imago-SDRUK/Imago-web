ALTER TABLE "configuration" ADD COLUMN "downloads_storage" uuid;--> statement-breakpoint
ALTER TABLE "configuration" ADD COLUMN "products_storage" uuid;--> statement-breakpoint
ALTER TABLE "configuration" ADD COLUMN "geographies_storage" uuid;--> statement-breakpoint
ALTER TABLE "configuration" ADD COLUMN "tiles_storage" uuid;--> statement-breakpoint
ALTER TABLE "configuration" ADD CONSTRAINT "configuration_downloads_storage_storages_id_fk" FOREIGN KEY ("downloads_storage") REFERENCES "public"."storages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "configuration" ADD CONSTRAINT "configuration_products_storage_storages_id_fk" FOREIGN KEY ("products_storage") REFERENCES "public"."storages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "configuration" ADD CONSTRAINT "configuration_geographies_storage_storages_id_fk" FOREIGN KEY ("geographies_storage") REFERENCES "public"."storages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "configuration" ADD CONSTRAINT "configuration_tiles_storage_storages_id_fk" FOREIGN KEY ("tiles_storage") REFERENCES "public"."storages"("id") ON DELETE set null ON UPDATE no action;