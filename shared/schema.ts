import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Gesture event schema
// Stores individual gesture events from students
export const gestures = pgTable("gestures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentName: text("student_name").notNull(),
  gestureType: text("gesture_type").notNull(), // 'wave', 'shake', 'tilt'
  message: text("message").notNull(), // Translated message like 'Needs Help'
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertGestureSchema = createInsertSchema(gestures).omit({
  id: true,
  timestamp: true,
});

export type InsertGesture = z.infer<typeof insertGestureSchema>;
export type Gesture = typeof gestures.$inferSelect;

// WebSocket message types for real-time communication
export type GestureEvent = {
  type: 'gesture';
  data: Gesture;
};

export type WebSocketMessage = GestureEvent;

// Analytics data structure for parent dashboard
export type GestureAnalytics = {
  totalToday: number;
  recognizedCount: number;
  weeklyData: Array<{
    day: string;
    count: number;
  }>;
  percentageChange: number;
  summary: string;
};
