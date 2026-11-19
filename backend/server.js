const express = require("express");
const http = require("http");
const cors = require("cors");
const { WebSocketServer } = require("ws");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

app.use(cors());
app.use(express.json());

// Broadcast WebSocket message to all connected partners
function broadcast(data) {
  const payload = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ ok: true, app: "TWOgether Backend", slogan: "Our future, together." });
});

// Authentication Endpoint (Private to Pedro & Emilly)
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const userOneEmail = (process.env.USER_ONE_EMAIL || "pedro@gmail.com").toLowerCase();
  const userOnePass = process.env.USER_ONE_PASSWORD || "13052009";
  const userTwoEmail = (process.env.USER_TWO_EMAIL || "emilly@gmail.com").toLowerCase();
  const userTwoPass = process.env.USER_TWO_PASSWORD || "11042011";

  if (cleanEmail === userOneEmail) {
    if (password !== userOnePass) {
      return res.status(401).json({ error: "Senha incorreta." });
    }
    return res.json({
      success: true,
      user: { id: 1, name: "Pedro", email: cleanEmail, currentMood: "Apaixonado(a) 🥰" },
    });
  }

  if (cleanEmail === userTwoEmail) {
    if (password !== userTwoPass) {
      return res.status(401).json({ error: "Senha incorreta." });
    }
    return res.json({
      success: true,
      user: { id: 2, name: "Emilly", email: cleanEmail, currentMood: "Em sintonia ✨" },
    });
  }

  return res.status(401).json({ error: "Acesso restrito. Somente Pedro e Emilly têm autorização." });
});

// Couple Space Info
app.get("/api/couple", async (req, res) => {
  res.json({
    couple: {
      name: "Pedro & Emilly",
      slogan: "Our future, together.",
      inviteCode: "TWOGETHER-2025",
      anniversaryDate: "2023-05-13",
      storySummary: "Construindo cada detalhe do nosso futuro, lado a lado, com carinho, cumplicidade e amor infinito.",
    },
    partners: [
      { id: 1, name: "Pedro", email: "pedro@gmail.com", currentMood: "Te amando mais a cada dia 💖" },
      { id: 2, name: "Emilly", email: "emilly@gmail.com", currentMood: "Contando os minutos para o próximo plano ✨" },
    ],
  });
});

// WebSocket Connection handler
wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ type: "WELCOME", message: "Conectado ao TWOgether Realtime" }));
});

server.listen(PORT, () => {
  console.log(`TWOgether server running on port ${PORT}`);
});
