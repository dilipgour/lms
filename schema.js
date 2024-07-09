import { pgTable, uuid, text, boolean, real, date,index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});


export const courses = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => user.id),
  title: text("title"),
  description: text("description"),
  imageUrl: text("image_url"),
  price: real("price"),
  isPublished: boolean("is_published").default(false),
  categoryId: uuid("category_id").references(()=>category.id),
  createdAt: date("created_at").default(sql`now()`),
  updatedAt: date("updated_at").default(sql`now()`),
  attachments: text("attachments")
},(courses) => {
  return {
    categoryIdIndex: index("category_id_index").on(courses.categoryId)
  }
});

export const category = pgTable("categories",{
  id : uuid("id").primaryKey().defaultRandom(),
  name : text("name").unique(),
  courseId : text("course_id")
})


export const attachments = pgTable("attachments", {
  id : uuid("id").primaryKey().defaultRandom(),
  name:text("name"),
  url : text("url"),
  createdAt: date("created_at").default(sql`now()`),
  courseId: uuid("course_id").references(() => courses.id, { onDelete: "cascade" })
},(attachments) => {
  return {
    courseIdIndex: index("course_id_index").on(attachments.courseId)
  }
});





