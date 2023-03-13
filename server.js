import express from "express";
import cors from "cors";
import routesHandler from "./api/routes.js";

// Test backend functions without creating full front end
// TODO: Remove path, fileURLToPath, and any references
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({origin: "http://localhost:3000" }));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use("/api/v1/store-items", routesHandler);
// TODO: return res.status(404).json({error: "not found"}) after front end is created
app.use("*", (req, res) => res.sendFile(path.join(__dirname, "/index.html")));

export default app;