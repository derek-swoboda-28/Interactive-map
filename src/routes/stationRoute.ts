import { StationController } from "@controllers/stationController";
import express from "express";

const router = express.Router();
const stationController = new StationController();

router.get("/allStations", stationController.GetAllStations as any);
router.post("/update", stationController.UpdateStation as any);
router.post("/find", stationController.GetStationById as any);

export default router