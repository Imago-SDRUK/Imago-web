CREATE TYPE "public"."product_requests_status_enum" AS ENUM('notified', 'error', 'requested');--> statement-breakpoint
CREATE TYPE "public"."product_resources_status_enum" AS ENUM('completed', 'error', 'requested', 'processing');--> statement-breakpoint
CREATE TABLE "product_options" (
	"created_by" uuid NOT NULL,
	"updated_by" uuid NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"value" text NOT NULL,
	"type" text NOT NULL,
	CONSTRAINT "product_options_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "product_requests" (
	"created_by" uuid NOT NULL,
	"updated_by" uuid NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"status" "product_requests_status_enum" DEFAULT 'requested' NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"product_id" uuid NOT NULL,
	"version" text NOT NULL,
	"year" integer NOT NULL,
	"options" uuid[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_resources" (
	"created_by" uuid NOT NULL,
	"updated_by" uuid NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"status" "product_resources_status_enum" DEFAULT 'requested' NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"product_id" uuid NOT NULL,
	"version" text NOT NULL,
	"year" integer NOT NULL,
	"options" uuid[] DEFAULT '{}' NOT NULL,
	"path" text,
	"filename" text,
	"metadata" jsonb,
	"messages" jsonb,
	"storage" uuid
);
--> statement-breakpoint
CREATE TABLE "products" (
	"created_by" uuid NOT NULL,
	"updated_by" uuid NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"versions" text[] DEFAULT '{}',
	"years" integer[] DEFAULT '{}',
	CONSTRAINT "products_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "products_product_options" (
	"created_by" uuid NOT NULL,
	"updated_by" uuid NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"product_id" uuid NOT NULL,
	"product_option_id" uuid NOT NULL,
	CONSTRAINT "products_product_options_product_id_product_option_id_pk" PRIMARY KEY("product_id","product_option_id")
);
--> statement-breakpoint
ALTER TABLE "product_options" ADD CONSTRAINT "product_options_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_options" ADD CONSTRAINT "product_options_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_requests" ADD CONSTRAINT "product_requests_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_requests" ADD CONSTRAINT "product_requests_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_requests" ADD CONSTRAINT "product_requests_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_resources" ADD CONSTRAINT "product_resources_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_resources" ADD CONSTRAINT "product_resources_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_resources" ADD CONSTRAINT "product_resources_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_resources" ADD CONSTRAINT "product_resources_storage_storages_id_fk" FOREIGN KEY ("storage") REFERENCES "public"."storages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products_product_options" ADD CONSTRAINT "products_product_options_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products_product_options" ADD CONSTRAINT "products_product_options_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products_product_options" ADD CONSTRAINT "products_product_options_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products_product_options" ADD CONSTRAINT "products_product_options_product_option_id_product_options_id_fk" FOREIGN KEY ("product_option_id") REFERENCES "public"."product_options"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_options_type_idx" ON "product_options" USING btree ("type");--> statement-breakpoint
CREATE INDEX "product_requests_product_id_idx" ON "product_requests" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_resources_product_id_idx" ON "product_resources" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_resources_storage_idx" ON "product_resources" USING btree ("storage");--> statement-breakpoint
CREATE INDEX "products_product_options_product_idx" ON "products_product_options" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "products_product_options_product_option_idx" ON "products_product_options" USING btree ("product_option_id");