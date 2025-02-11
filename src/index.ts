import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import path from "path";
import { connectDB } from "@config/index";

import StationRouter from "@routes/stationRoute";
import MapRouter from "@routes/mapRoute";
import DeviceRouter from "@routes/deviceRoute";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// ✅ No need to redefine __dirname, it's already available in CommonJS

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the public directory
app.use('/public/maps', express.static(path.join(__dirname, '../public/maps')));

// Connect to the database
connectDB();

// ✅ API Routes
app.use("/api/v1/station", StationRouter);
app.use("/api/v1/map", MapRouter);
app.use("/api/v1/device", DeviceRouter);

// ✅ Serve React Frontend (AFTER API routes)
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

// Start the server
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
