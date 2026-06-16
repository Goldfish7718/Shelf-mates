import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

config();

const app = express();
const PORT = process.env.PORT || 5000;

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Welcome to Shelf mates PROXY",status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Proxy server started on port ${PORT}`);
});
