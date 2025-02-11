import { MapController } from "@controllers/mapController";
import express from "express";

const router = express.Router();
const mapController = new MapController();

router.post("/upload", mapController.UploadMapFile as any);
router.get("/getMap", mapController.GetMap as any);

export default router