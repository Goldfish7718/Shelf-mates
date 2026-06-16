import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

config();

const app = express();
const PORT = process.env.PORT || 5000;

const MAIN_API_URL = process.env.MAIN_API_URL || "http://localhost:3000";
const AGENT_API_URL = process.env.AGENT_API_URL || "http://localhost:8000";

if (process.env.ORIGIN) {
  app.use(
    cors({
      credentials: true,
      origin: process.env.ORIGIN,
    }),
  );
} else {
  app.use(cors());
}

app.use(cookieParser());

app.use(
  "/chat",
  createProxyMiddleware({
    target: AGENT_API_URL,
    changeOrigin: true,
    ws: true,
  })
);

app.use(
  ["/auth", "/product", "/cart", "/order", "/address", "/review", "/admin"],
  createProxyMiddleware({
    target: MAIN_API_URL,
    changeOrigin: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Welcome to Shelf mates PROXY", status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Proxy server started on port ${PORT}`);
});
