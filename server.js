import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const chat = model.startChat({});
    const result = await chat.sendMessage(prompt);
    const text = result?.response?.text();
    if (!text) return res.status(500).json({ error: "No response from model" });

    res.json({ text });
  } catch (err) {
    console.error("Google AI error:", err);
    res.status(500).json({ error: err.message || "Failed to get response" });
  }
});

app.listen(4000, () => console.log("Server running on port 4000"));
