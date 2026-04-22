CREATE TABLE "configuration" (
	"id" text PRIMARY KEY DEFAULT 'config' NOT NULL,
	"admin_group" uuid,
	"superusers" uuid[] DEFAULT '{}',
	CONSTRAINT "configuration_id_unique" UNIQUE("id"),
	CONSTRAINT "one_row_only" CHECK ("configuration"."id" = 'config')
);
