import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { OpenAI } from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN!;
const PAGE_ID = process.env.PAGE_ID!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const GRAPH_URL = "https://graph.facebook.com/v19.0";
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

app.get("/api/posts", async (req, res) => {
  try {
    const url = `${GRAPH_URL}/${PAGE_ID}/posts`;
    const params = {
      access_token: ACCESS_TOKEN,
      limit: req.query.limit || 5,
      fields: "id,message,created_time,attachments{media_type,media,target}",
    };
    const resp = await axios.get(url, { params });
    res.json(resp.data.data || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts." });
  }
});

app.get("/api/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const url = `${GRAPH_URL}/${postId}/comments`;
    const params = {
      access_token: ACCESS_TOKEN,
      limit: req.query.limit || 10,
      fields: "id,message,created_time,from",
    };
    const resp = await axios.get(url, { params });
    res.json(resp.data.data || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments." });
  }
});

app.post("/api/comments/:commentId/reply", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const url = `${GRAPH_URL}/${commentId}/comments`;
    const data = { message: text, access_token: ACCESS_TOKEN };
    const resp = await axios.post(url, data);
    res.json({ success: resp.status === 200 });
  } catch (err) {
    res.status(500).json({ error: "Failed to reply." });
  }
});

app.post("/api/generate-reply", async (req, res) => {
  try {
    const { text } = req.body;
    const prompt = `Reply politely in under 15 tokens with relevant emojis:\n"${text}"`;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 30,
      temperature: 0.7,
    });
    res.json({ reply: completion.choices[0].message?.content?.trim() ?? "" });
  } catch (err) {
    res.status(500).json({ error: "OpenAI error." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
