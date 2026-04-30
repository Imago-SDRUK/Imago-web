CREATE INDEX "users_groups_group_idx" ON "users_groups" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "users_groups_user_idx" ON "users_groups" USING btree ("user_id");