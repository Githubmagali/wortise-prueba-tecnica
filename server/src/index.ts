import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./lib/auth.js";
import articles from "./routes/articles.js";
import publicRoutes from "./routes/public.js";

const app = new Hono();
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(
  "*",
  cors({
    origin: corsOrigin,
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));
app.route("/api/articles", articles);
app.route("/api/public", publicRoutes);
app.get("/api/health", (c) => c.json({ ok: true }));

const port = Number(process.env.PORT) || 3001;

serve({ fetch: app.fetch, port });

console.log(`Server escuchando en http://localhost:${port}`);