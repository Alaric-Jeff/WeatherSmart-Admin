import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Resolve `.env` from the backend project root so it works in both `src` (ts-node-dev)
// and `dist` (compiled JS) builds.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "..", ".env");

dotenv.config({ path: envPath });

console.log("Env loaded from:", envPath, {
  HTTP_PORT: process.env.HTTP_PORT,
  HOST: process.env.HOST,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
});

// Use dynamic import so env config runs BEFORE server module executes.
await import("./server.js");
