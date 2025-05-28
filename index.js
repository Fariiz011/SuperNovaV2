// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  chatMessages;
  currentUserId;
  currentMessageId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.chatMessages = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentMessageId = 1;
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = {
      ...insertUser,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, user);
    return user;
  }
  async getChatMessages(userId) {
    return Array.from(this.chatMessages.values()).filter(
      (message) => message.userId === userId
    );
  }
  async createChatMessage(insertMessage) {
    const id = this.currentMessageId++;
    const message = {
      ...insertMessage,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.chatMessages.set(id, message);
    return message;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow()
});
var chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  message: text("message").notNull(),
  response: text("response"),
  isVoice: boolean("is_voice").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  name: true
});
var insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  message: true,
  response: true,
  isVoice: true
});

// server/routes.ts
import bcrypt from "bcrypt";
async function registerRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      const { password, ...userResponse } = user;
      res.json({ user: userResponse });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });
  app2.post("/api/chat/message", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse(req.body);
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
  app2.get("/api/chat/history/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const messages = await storage.getChatMessages(userId);
      res.json({ messages });
    } catch (error) {
      res.status(500).json({ message: "Failed to get chat history" });
    }
  });
  app2.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }
      const imageBuffer = await generateImageWithOpenAI(prompt);
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Content-Disposition", 'inline; filename="generated-image.png"');
      res.send(imageBuffer);
    } catch (error) {
      console.error("Image generation error:", error);
      res.status(500).json({
        message: "Failed to generate image",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}
async function generateCohereResponse(message) {
  const COHERE_API_KEY = process.env.COHERE_API_KEY || process.env.VITE_COHERE_API_KEY || "default_key";
  try {
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command-r-plus",
        prompt: `Kamu adalah SuperNova, asisten AI yang sangat pintar dan ramah. Kamu mahir berbahasa Indonesia dan Inggris. Selalu jawab dengan natural dan membantu. Jika user berbahasa Indonesia, jawab dalam bahasa Indonesia yang baik dan benar. Jika user berbahasa Inggris, jawab dalam bahasa Inggris.

Pesan user: ${message}

Jawaban SuperNova:`,
        max_tokens: 500,
        temperature: 0.7,
        stop_sequences: ["User:", "Pesan user:"]
      })
    });
    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.status}`);
    }
    const data = await response.json();
    return data.generations[0].text.trim();
  } catch (error) {
    console.error("Cohere API error:", error);
    const isIndonesian = /[a-zA-Z\s]*/.test(message) && (message.toLowerCase().includes("halo") || message.toLowerCase().includes("hai") || message.toLowerCase().includes("selamat") || message.toLowerCase().includes("apa") || message.toLowerCase().includes("bagaimana"));
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
async function generateImageWithOpenAI(prompt) {
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
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          model: "dall-e-3",
          // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          response_format: "url"
        })
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

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
