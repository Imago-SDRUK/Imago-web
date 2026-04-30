ALTER TABLE "users_to_groups" RENAME TO "users_groups";--> statement-breakpoint
ALTER TABLE "users_groups" DROP CONSTRAINT "users_to_groups_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users_groups" DROP CONSTRAINT "users_to_groups_group_id_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "users_groups" DROP CONSTRAINT "users_to_groups_user_id_group_id_pk";--> statement-breakpoint
ALTER TABLE "groups" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "groups" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "groups" ALTER COLUMN "datasets" SET DATA TYPE uuid[];--> statement-breakpoint
ALTER TABLE "users_groups" ADD CONSTRAINT "users_groups_user_id_group_id_pk" PRIMARY KEY("user_id","group_id");--> statement-breakpoint
ALTER TABLE "groups" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users_groups" ADD CONSTRAINT "users_groups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_groups" ADD CONSTRAINT "users_groups_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "groups_slug_idx" ON "groups" USING btree ("slug");--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_title_unique" UNIQUE("title");--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_slug_unique" UNIQUE("slug");
