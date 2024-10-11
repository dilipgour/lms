CREATE TABLE IF NOT EXISTS "stripe_costumer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"stripe_costumer_id" text,
	"created_at" date DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "is_free" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "userprogress" ADD COLUMN "created_at" date DEFAULT now();--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stripe_costumer" ADD CONSTRAINT "stripe_costumer_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
