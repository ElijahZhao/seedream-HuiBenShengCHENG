import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createSchemaFactory } from "drizzle-zod";
import { z } from "zod";

// 用户表
export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 128 }).notNull(),
    password: text("password"),
    avatar: varchar("avatar", { length: 500 }),
    isActive: boolean("is_active").default(true).notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
  })
);

// 绘本表
export const picturebooks = pgTable(
  "picturebooks",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    theme: varchar("theme", { length: 255 }).notNull(),
    description: text("description").notNull(),
    ageGroup: varchar("age_group", { length: 20 }).notNull(),
    style: varchar("style", { length: 50 }).notNull(),
    pageCount: integer("page_count").notNull(),
    storyData: jsonb("story_data").notNull(),
    coverImage: varchar("cover_image", { length: 500 }),
    isPublished: boolean("is_published").default(false).notNull(),
    viewCount: integer("view_count").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    userIdIdx: index("picturebooks_user_id_idx").on(table.userId),
    isPublishedIdx: index("picturebooks_is_published_idx").on(table.isPublished),
  })
);

// 使用 createSchemaFactory 配置 date coercion（处理前端 string → Date 转换）
const { createInsertSchema: createCoercedInsertSchema } = createSchemaFactory({
  coerce: { date: true },
});

// User schemas
export const insertUserSchema = createCoercedInsertSchema(users).pick({
  email: true,
  name: true,
  password: true,
  avatar: true,
  metadata: true,
});

export const updateUserSchema = createCoercedInsertSchema(users)
  .pick({
    email: true,
    name: true,
    avatar: true,
    isActive: true,
    metadata: true,
  })
  .partial();

// Picturebook schemas
export const insertPicturebookSchema = createCoercedInsertSchema(picturebooks).pick({
  userId: true,
  title: true,
  theme: true,
  description: true,
  ageGroup: true,
  style: true,
  pageCount: true,
  storyData: true,
  coverImage: true,
  isPublished: true,
  viewCount: true,
});

export const updatePicturebookSchema = createCoercedInsertSchema(picturebooks)
  .pick({
    title: true,
    theme: true,
    description: true,
    ageGroup: true,
    style: true,
    pageCount: true,
    storyData: true,
    coverImage: true,
    isPublished: true,
    viewCount: true,
  })
  .partial();

// TypeScript types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

export type Picturebook = typeof picturebooks.$inferSelect;
export type InsertPicturebook = z.infer<typeof insertPicturebookSchema>;
export type UpdatePicturebook = z.infer<typeof updatePicturebookSchema>;
