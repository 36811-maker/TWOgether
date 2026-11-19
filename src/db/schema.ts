import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  role: text("role").default("partner"),
  currentMood: text("current_mood").default("Apaixonado(a) 🥰"),
  moodUpdatedAt: timestamp("mood_updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const coupleSpace = pgTable("couple_space", {
  id: serial("id").primaryKey(),
  name: text("name").default("Pedro & Emilly"),
  slogan: text("slogan").default("Our future, together."),
  inviteCode: text("invite_code").default("TWOGETHER-2025"),
  anniversaryDate: text("anniversary_date").default("2023-05-13"),
  storySummary: text("story_summary").default("Construindo cada detalhe do nosso futuro, lado a lado, com carinho, cumplicidade e amor infinito."),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull().default("Vida a Dois"),
  targetDate: text("target_date"),
  progress: integer("progress").default(0),
  status: text("status").default("Em andamento"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dreams = pgTable("dreams", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull().default("Experiências"),
  priority: text("priority").default("Alta"),
  estimatedCost: text("estimated_cost"),
  completed: boolean("completed").default(false),
  completedDate: text("completed_date"),
  imageUrl: text("image_url"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const calendarEvents = pgTable("calendar_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date").notNull(),
  time: text("time"),
  category: text("category").notNull().default("Encontro"),
  isMilestone: boolean("is_milestone").default(false),
  countdown: boolean("countdown").default(true),
  location: text("location"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const homePlans = pgTable("home_plans", {
  id: serial("id").primaryKey(),
  room: text("room").notNull().default("Sala de Estar"),
  item: text("item").notNull(),
  description: text("description"),
  priority: text("priority").default("Essencial"),
  estimatedPrice: text("estimated_price"),
  purchased: boolean("purchased").default(false),
  inspirationUrl: text("inspiration_url"),
  notes: text("notes"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const finances = pgTable("finances", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull().default("reserva"), // reserva, despesa, contribuicao
  amount: text("amount").notNull(),
  targetAmount: text("target_amount"),
  category: text("category").notNull().default("Casa Nova"),
  payer: text("payer").default("Ambos"),
  date: text("date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  destination: text("destination").notNull(),
  startDate: text("start_date"),
  endDate: text("end_date"),
  status: text("status").default("Planejando"), // Planejando, Confirmada, Realizada
  budget: text("budget"),
  coverImage: text("cover_image"),
  itinerary: text("itinerary").default("[]"), // JSON string
  packingList: text("packing_list").default("[]"), // JSON string
  placesToVisit: text("places_to_visit").default("[]"), // JSON string
  notes: text("notes"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const memories = pgTable("memories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  location: text("location"),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  category: text("category").default("Especial"),
  favorite: boolean("favorite").default(false),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const letters = pgTable("letters", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  sender: text("sender").notNull(),
  recipient: text("recipient").notNull(),
  content: text("content").notNull(),
  type: text("type").default("carta_amor"), // carta_amor, capsula_tempo, abra_quando, bilhete_rapido
  openCondition: text("open_condition"),
  unlockDate: text("unlock_date"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const timeline = pgTable("timeline", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").default("Marco"),
  imageUrl: text("image_url"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notesBoard = pgTable("notes_board", {
  id: serial("id").primaryKey(),
  author: text("author").notNull(),
  content: text("content").notNull(),
  color: text("color").default("rose"),
  pinned: boolean("pinned").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
