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

  // Generate image endpoint
  app.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      const imageBuffer = await generateImageWithOpenAI(prompt);
      
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', 'inline; filename="generated-image.png"');
      res.send(imageBuffer);
    } catch (error) {
      console.error("Image generation error:", error);
      res.status(500).json({ 
        message: "Failed to generate image", 
        error: error instanceof Error ? error.message : "Unknown error"
      });
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
        prompt: `Kamu adalah SuperNova, asisten AI yang sangat pintar dan ramah. Kamu mahir berbahasa Indonesia dan Inggris. Selalu jawab dengan natural dan membantu. Jika user berbahasa Indonesia, jawab dalam bahasa Indonesia yang baik dan benar. Jika user berbahasa Inggris, jawab dalam bahasa Inggris.

Pesan user: ${message}

Jawaban SuperNova:`,
        max_tokens: 250,
        temperature: 0.8,
        stop_sequences: ["User:", "Pesan user:"],
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

async function generateImageWithOpenAI(prompt: string): Promise<Buffer> {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }
  
  try {
    console.log("Generating image with DALL-E 3, prompt:", prompt);
    
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          model: "dall-e-3", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          response_format: "url"
        }),
      }
    );

    console.log("OpenAI Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("OpenAI Error response:", errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;
    
    // Download the image from the URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error("Failed to download generated image");
    }
    
    const arrayBuffer = await imageResponse.arrayBuffer();
    console.log("Image generated successfully with DALL-E 3, size:", arrayBuffer.byteLength);
    return Buffer.from(arrayBuffer);
    
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
}
