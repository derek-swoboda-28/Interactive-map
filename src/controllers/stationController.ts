import Station from "@models/Stations";
import { Request, Response } from "express";
import multer from "multer";
import path from "path";

export class StationController {
  mapStorage = multer.diskStorage({
    destination: "./public/maps/",
    filename: (req: any, file: any, cb: any) => {
      cb(null, "map-" + Date.now() + path.extname(file.originalname));
    },
  });

  UploadMap = multer({
    storage: this.mapStorage,
    limits: { fileSize: 150 * 1024 * 1024 },
  }).single("image");

  GetAllStations = async (req: Request, res: Response) => {
    const existingStations = await Station.find()
    if (existingStations.length > 0) {
      return res.status(200).json({
        status: true,
        stations: existingStations
      });
    } else {
      return res.status(200).json({
        status: true,
        stations: []
      });
    }
  }

  GetStationById = async (req: Request, res: Response) => {
    const { stationId } = req.body
    const existingStation = await Station.findById(stationId);
    return res.status(200).json({
      status: true,
      station: existingStation,
    });
  }

  UpdateStation = async (req: Request, res: Response) => {
    const { stationId, batteryLevel, batteryDescription, batteryVoltage, rssi } = req.body;
    const existingStation = await Station.findOne({stationId: stationId})
    if (existingStation) {
      const tempData = {
        battery: {
          description: batteryDescription,
          level: parseFloat(batteryLevel),
          voltage: parseFloat(batteryVoltage)
        },
        rssi: parseFloat(rssi)
      }
      const updatedStation = await Station.findOneAndUpdate({ stationId: stationId }, tempData, {new: true})
      return res.status(200).json({
        status: true,
        message: "Station is updated successfully!",
        updatedStation: updatedStation
      });
    } else {
      return res.status(304).json({
        status: false,
        message: "Not Station Here!"
      });
    }
  }
}