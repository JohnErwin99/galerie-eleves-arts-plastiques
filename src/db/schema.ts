import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  schoolYear: text("school_year"),
  coverArtworkId: integer("cover_artwork_id"),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const artworks = sqliteTable("artworks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  studentFirstName: text("student_first_name").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  medium: text("medium"),
  createdDate: text("created_date"),
  imagePath: text("image_path").notNull(),
  thumbPath: text("thumb_path").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Identifiants de l'admin unique. Une seule ligne (id = 1), initialisée depuis
// les variables d'environnement au premier accès, puis modifiable via la
// réinitialisation du mot de passe.
export const adminCredentials = sqliteTable("admin_credentials", {
  id: integer("id").primaryKey(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Project = typeof projects.$inferSelect;
export type Artwork = typeof artworks.$inferSelect;
