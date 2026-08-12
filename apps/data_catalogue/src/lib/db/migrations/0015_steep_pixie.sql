ALTER TABLE "downloads" DROP CONSTRAINT "downloads_resource_resources_id_fk";
--> statement-breakpoint
ALTER TABLE "downloads" ALTER COLUMN "resource" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "downloads" ADD COLUMN "type" text DEFAULT 'resource' NOT NULL;