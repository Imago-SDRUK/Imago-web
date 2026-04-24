ALTER TABLE "users_groups" DROP CONSTRAINT "users_groups_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users_groups" DROP CONSTRAINT "users_groups_updated_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users_groups" DROP CONSTRAINT "users_groups_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users_groups" DROP CONSTRAINT "users_groups_group_id_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "users_groups" ALTER COLUMN "created_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users_groups" ALTER COLUMN "updated_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users_groups" ADD CONSTRAINT "users_groups_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_groups" ADD CONSTRAINT "users_groups_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_groups" ADD CONSTRAINT "users_groups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_groups" ADD CONSTRAINT "users_groups_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;