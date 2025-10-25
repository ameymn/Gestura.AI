import { type Gesture, type InsertGesture } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getGesture(id: string): Promise<Gesture | undefined>;
  getAllGestures(): Promise<Gesture[]>;
  getGesturesToday(): Promise<Gesture[]>;
  createGesture(gesture: InsertGesture): Promise<Gesture>;
  getWeeklyGestures(): Promise<Gesture[]>;
}

export class MemStorage implements IStorage {
  private gestures: Map<string, Gesture>;

  constructor() {
    this.gestures = new Map();
  }

  async getGesture(id: string): Promise<Gesture | undefined> {
    return this.gestures.get(id);
  }

  async getAllGestures(): Promise<Gesture[]> {
    return Array.from(this.gestures.values());
  }

  async getGesturesToday(): Promise<Gesture[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return Array.from(this.gestures.values()).filter(
      (gesture) => new Date(gesture.timestamp) >= today
    );
  }

  async getWeeklyGestures(): Promise<Gesture[]> {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return Array.from(this.gestures.values()).filter(
      (gesture) => new Date(gesture.timestamp) >= weekAgo
    );
  }

  async createGesture(insertGesture: InsertGesture): Promise<Gesture> {
    const id = randomUUID();
    const gesture: Gesture = {
      ...insertGesture,
      id,
      timestamp: new Date(),
    };
    this.gestures.set(id, gesture);
    return gesture;
  }
}

export const storage = new MemStorage();
