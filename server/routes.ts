import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertChatMessageSchema } from "@shared/schema";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  // User registration
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });

      // Remove password from response
      const { password, ...userResponse } = user;
      res.json({ user: userResponse });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  // Chat message endpoint
  app.post("/api/chat/message", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse(req.body);
      
      // Generate AI response using Cohere API
      const aiResponse = await generateCohereResponse(messageData.message);
      
      const chatMessage = await storage.createChatMessage({
        ...messageData,
        response: aiResponse
      });

      res.json({ message: chatMessage });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Get chat history
  app.get("/api/chat/history/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const messages = await storage.getChatMessages(userId);
      res.json({ messages });
    } catch (error) {
      res.status(500).json({ message: "Failed to get chat history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function generateCohereResponse(message: string): Promise<string> {
  const COHERE_API_KEY = process.env.COHERE_API_KEY || process.env.VITE_COHERE_API_KEY || "default_key";
  
  try {
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command",
        prompt: `You are SuperNova, a helpful AI assistant that can speak both Indonesian and English. Respond naturally and helpfully to: ${message}`,
        max_tokens: 200,
        temperature: 0.7,
        stop_sequences: [],
      }),
    });

    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.status}`);
    }

    const data = await response.json();
    return data.generations[0].text.trim();
  } catch (error) {
    console.error("Cohere API error:", error);
    
    // Fallback responses based on language detection
    const isIndonesian = /[a-zA-Z\s]*/.test(message) && 
      (message.toLowerCase().includes('halo') || 
       message.toLowerCase().includes('hai') || 
       message.toLowerCase().includes('selamat') ||
       message.toLowerCase().includes('apa') ||
       message.toLowerCase().includes('bagaimana'));

    const fallbackResponses = {
      indonesian: [
        "Halo! Saya SuperNova, asisten AI Anda. Bagaimana saya bisa membantu Anda hari ini?",
        "Tentu saja! Saya siap membantu Anda dengan pertanyaan apapun.",
        "Terima kasih sudah menggunakan SuperNova. Ada yang bisa saya bantu?",
        "Maaf, saya mengalami sedikit masalah teknis. Bisakah Anda mengulangi pertanyaan Anda?",
        "Saya senang bisa berbicara dengan Anda! Apa yang ingin Anda ketahui?"
      ],
      english: [
        "Hello! I'm SuperNova, your AI assistant. How can I help you today?",
        "Sure, I'm ready to help you with any questions you might have.",
        "Thank you for using SuperNova. Is there anything I can assist you with?",
        "I apologize, I'm having some technical difficulties. Could you please repeat your question?",
        "I'm happy to chat with you! What would you like to know?"
      ]
    };

    const responses = isIndonesian ? fallbackResponses.indonesian : fallbackResponses.english;
    return responses[Math.floor(Math.random() * responses.length)];
  }
}
