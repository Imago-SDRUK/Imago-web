ALTER TABLE "product_options" ADD COLUMN "variable" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product_options" ADD CONSTRAINT "product_options_variable_unique" UNIQUE("variable");