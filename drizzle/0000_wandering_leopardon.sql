CREATE TABLE "picturebooks" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"title" varchar(255) NOT NULL,
	"theme" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"age_group" varchar(20) NOT NULL,
	"style" varchar(50) NOT NULL,
	"page_count" integer NOT NULL,
	"story_data" jsonb NOT NULL,
	"cover_image" varchar(500),
	"is_published" boolean DEFAULT false NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(128) NOT NULL,
	"password" text,
	"avatar" varchar(500),
	"is_active" boolean DEFAULT true NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "picturebooks" ADD CONSTRAINT "picturebooks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "picturebooks_user_id_idx" ON "picturebooks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "picturebooks_is_published_idx" ON "picturebooks" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");