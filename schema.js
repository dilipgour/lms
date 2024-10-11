import { pgTable, uuid, text, boolean, real, date,index,integer } from "drizzle-orm/pg-core";
import { sql,relations } from "drizzle-orm";

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

export const chapters = pgTable("chapters", {
  id : uuid("id").primaryKey().defaultRandom(),
  title:text("title").notNull(),
  description:text("description"),
  videoUrl:text("videoUrl"),
  position: integer("position"),
  isPublished: boolean("is_published").default(false),
  isFree: boolean("is_free").default(false),
  courseId:uuid("course_id").references(() => courses.id, { onDelete: "cascade" }),
  createdAt: date("created_at").default(sql`now()`)
},(chapters) => {
  return {
    courseIdIndexOnchapter: index("courses_id_index").on(chapters.courseId)
  }
})

export const muxData = pgTable("muxData",{
  id : uuid("id").primaryKey().defaultRandom(),
  assetId : text("assetId").notNull(),
  playbackId : text("playbackId").notNull(),
  chapterId : uuid("chapter_id").references(()=>
  chapters.id,{ onDelete: "cascade" })
  })

export const userprogress = pgTable("userprogress",{
  id : uuid("id").primaryKey().defaultRandom(),
  isCompeleted: boolean("is_compeleted").default(false),
  userId: uuid("user_id"),
  chapterId : uuid("chapter_id").references(()=>
  chapters.id,{ onDelete: "cascade" }),
  createdAt: date("created_at").default(sql`now()`)
})


export const purchases  = pgTable("purchases",{
  id: uuid("id").primaryKey().defaultRandom(),
  courseId : uuid("course_id").references(()=>courses.id,{onDelete:"cascade"}),
  userId : uuid("user_id").references(()=>user.id,{onDelete:"cascade"}),
  createdAt: date("created_at").default(sql`now()`)
})

export const StripeCostumer = pgTable("stripe_costumer",{
   id: uuid("id").primaryKey().defaultRandom(),
   userId : uuid("user_id").references(()=>user.id,{onDelete:"cascade"}),
   stripeCostumerId : text("stripe_costumer_id"),
   createdAt: date("created_at").default(sql`now()`)
})

// User to Courses
export const userRelations = relations(user, ({ many }) => ({
  courses: many(courses),
}));

// Courses to User
export const courseUserRelations = relations(courses, ({ one }) => ({
  user: one(user, {
    fields: [courses.userId],
    references: [user.id],
  }),
}));

// Courses to Category
export const courseCategoryRelations = relations(courses, ({ one }) => ({
  category: one(category, {
    fields: [courses.categoryId],
    references: [category.id],
  }),
}));

// Category to Courses
export const categoryCoursesRelations = relations(category, ({ many }) => ({
  courses: many(courses),
}));

// Attachments to Courses
export const attachmentCourseRelations = relations(attachments, ({ one }) => ({
  course: one(courses, {
    fields: [attachments.courseId],
    references: [courses.id],
  }),
}));

// Chapters to Courses
export const chapterCourseRelations = relations(chapters, ({ one }) => ({
  course: one(courses, {
    fields: [chapters.courseId],
    references: [courses.id],
  }),
}));

// MuxData to Chapters
export const muxDataChapterRelations = relations(muxData, ({ one }) => ({
  chapter: one(chapters, {
    fields: [muxData.chapterId],
    references: [chapters.id],
  }),
}));

// UserProgress to Chapters
export const userProgressChapterRelations = relations(userprogress, ({ one }) => ({
  chapter: one(chapters, {
    fields: [userprogress.chapterId],
    references: [chapters.id],
  }),
}));

// UserProgress to User
export const userProgressUserRelations = relations(userprogress, ({ one }) => ({
  user: one(user, {
    fields: [userprogress.userId],
    references: [user.id],
  }),
}));

// Purchases to User
export const purchaseUserRelations = relations(purchases, ({ one }) => ({
  user: one(user, {
    fields: [purchases.userId],
    references: [user.id],
  }),
}));

// Purchases to Courses
export const purchaseCourseRelations = relations(purchases, ({ one }) => ({
  course: one(courses, {
    fields: [purchases.courseId],
    references: [courses.id],
  }),
}));

// StripeCostumer to User
export const stripeCostumerUserRelations = relations(StripeCostumer, ({ one }) => ({
  user: one(user, {
    fields: [StripeCostumer.userId],
    references: [user.id],
  }),
}));
