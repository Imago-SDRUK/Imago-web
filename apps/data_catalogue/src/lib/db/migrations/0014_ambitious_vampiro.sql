ALTER TABLE "questions" ADD COLUMN "sort" text;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_sort_unique" UNIQUE("sort");