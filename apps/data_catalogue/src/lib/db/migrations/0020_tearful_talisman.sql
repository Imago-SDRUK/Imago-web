CREATE TABLE "product_option_groups" (
	"created_by" uuid NOT NULL,
	"updated_by" uuid NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"value" text NOT NULL,
	"multiple" boolean DEFAULT false NOT NULL,
	"required" boolean DEFAULT true NOT NULL,
	"min_selection" integer DEFAULT 1 NOT NULL,
	"max_selection" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "product_option_groups_name_unique" UNIQUE("name")
);
--> statement-breakpoint
DROP INDEX "product_options_type_idx";--> statement-breakpoint
ALTER TABLE "product_options" ADD COLUMN "group_id" uuid;--> statement-breakpoint
ALTER TABLE "product_option_groups" ADD CONSTRAINT "product_option_groups_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_option_groups" ADD CONSTRAINT "product_option_groups_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_options" ADD CONSTRAINT "product_options_group_id_product_option_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."product_option_groups"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_options_product_option_groups_idx" ON "product_options" USING btree ("group_id");--> statement-breakpoint
ALTER TABLE "product_options" DROP COLUMN "type";