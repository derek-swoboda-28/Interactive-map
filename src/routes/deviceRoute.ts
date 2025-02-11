import { DeviceController } from "@controllers/deviceController";
import express from "express";

const router = express.Router();
const deviceController = new DeviceController();

router.post("/search", deviceController.SearchMachine as any);
router.post("/add", deviceController.AddNewDevice as any);
router.post("/find", deviceController.FineMachine as any);
router.post("/allDevices", deviceController.GetMachineByStationId as any);
router.post("/update", deviceController.UpdateDevice as any);

export default router