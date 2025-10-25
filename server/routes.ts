import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertGestureSchema, type GestureAnalytics, type WebSocketMessage } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server setup for real-time gesture broadcasting
  // Uses distinct path '/ws' to avoid conflicts with Vite's HMR websocket
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Broadcast gesture to all connected WebSocket clients
  const broadcastGesture = (message: WebSocketMessage) => {
    const messageStr = JSON.stringify(message);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  };

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // API Routes
  // All routes are prefixed with /api

  // POST /api/gestures - Submit a new gesture
  // Receives gesture data from student's mobile device (sensor simulation)
  // Validates, stores, and broadcasts the gesture in real-time
  app.post("/api/gestures", async (req, res) => {
    try {
      // Validate request body against schema
      const gestureData = insertGestureSchema.parse(req.body);
      
      // Store gesture in memory
      const gesture = await storage.createGesture(gestureData);
      
      // Broadcast to all connected WebSocket clients (teacher dashboard)
      broadcastGesture({
        type: 'gesture',
        data: gesture,
      });

      console.log(`Gesture received: ${gesture.studentName} - ${gesture.message}`);
      
      res.status(201).json(gesture);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid gesture data", details: error.errors });
      } else {
        console.error("Error creating gesture:", error);
        res.status(500).json({ error: "Failed to create gesture" });
      }
    }
  });

  // GET /api/gestures/today - Get all gestures from today
  // Used by teacher dashboard to show daily activity
  app.get("/api/gestures/today", async (_req, res) => {
    try {
      const gestures = await storage.getGesturesToday();
      res.json(gestures);
    } catch (error) {
      console.error("Error fetching today's gestures:", error);
      res.status(500).json({ error: "Failed to fetch gestures" });
    }
  });

  // GET /api/analytics - Get analytics data for parent dashboard
  // Aggregates gesture data into meaningful metrics and insights
  app.get("/api/analytics", async (_req, res) => {
    try {
      const todayGestures = await storage.getGesturesToday();
      const weeklyGestures = await storage.getWeeklyGestures();

      // Calculate total gestures today
      const totalToday = todayGestures.length;

      // All gestures are recognized in this MVP (100% recognition rate)
      // In production, this would compare against ML model predictions
      const recognizedCount = totalToday;

      // Calculate weekly data for chart
      const weeklyData = [];
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        
        const count = weeklyGestures.filter(g => {
          const gestureDate = new Date(g.timestamp);
          return gestureDate >= date && gestureDate < nextDate;
        }).length;

        weeklyData.push({
          day: dayNames[date.getDay()],
          count,
        });
      }

      // Calculate percentage change vs last week
      // For this MVP, we'll compare the last 3 days vs the 3 days before that
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);

      const recentCount = weeklyGestures.filter(g => 
        new Date(g.timestamp) >= threeDaysAgo
      ).length;

      const previousCount = weeklyGestures.filter(g => {
        const date = new Date(g.timestamp);
        return date >= sixDaysAgo && date < threeDaysAgo;
      }).length;

      const percentageChange = previousCount === 0 
        ? (recentCount > 0 ? 100 : 0)
        : Math.round(((recentCount - previousCount) / previousCount) * 100);

      // Generate summary text based on activity
      let summary = '';
      if (totalToday === 0) {
        summary = "No gestures recorded today yet. Encourage your child to use Gestura to communicate their needs in the classroom.";
      } else if (totalToday === 1) {
        summary = `Your child communicated 1 time today using Gestura. This shows growing confidence in expressing their needs independently.`;
      } else {
        const studentName = todayGestures[0]?.studentName || "Your child";
        const changeText = percentageChange > 0 
          ? `showing ${percentageChange}% more activity than earlier this week`
          : percentageChange < 0
          ? `with ${Math.abs(percentageChange)}% less activity than earlier this week`
          : 'maintaining consistent communication';

        summary = `${studentName} tried to communicate ${totalToday} times today, ${changeText}. Each gesture represents their growing independence and confidence in the classroom.`;
      }

      const analytics: GestureAnalytics = {
        totalToday,
        recognizedCount,
        weeklyData,
        percentageChange,
        summary,
      };

      res.json(analytics);
    } catch (error) {
      console.error("Error generating analytics:", error);
      res.status(500).json({ error: "Failed to generate analytics" });
    }
  });

  // Extension point for future ML gesture model integration:
  // To add custom ML-based gesture recognition:
  // 1. Train a model using TensorFlow.js or similar framework
  // 2. Load the model in this file: const model = await tf.loadLayersModel('path/to/model');
  // 3. In POST /api/gestures, before storing:
  //    - Extract motion features from the gesture data
  //    - Run prediction: const prediction = model.predict(features);
  //    - Map prediction to message type
  //    - Store the predicted gesture type
  // 4. Update recognizedCount in analytics to compare original vs predicted gestures

  return httpServer;
}
