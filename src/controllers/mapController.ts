import Map from "@models/Maps";
import Station from "@models/Stations";
import { Request, Response } from "express";
import multer from "multer";
import path from "path";

export class MapController {
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

  UploadMapFile = async (req: Request, res: Response) => {
    const protocol = req.protocol;
    const host = req.get('host');
    this.UploadMap(req, res, async () => {
      const path = `${process.env.SERVER_URL}/public/maps/` + req.file?.filename;
      const stations = JSON.parse(req.body.stationId)
      const tempNewMap = new Map({
        mapUrl: path
      })

      const newMap = await tempNewMap.save()

      for (let station of stations) {
        const existingStation = await Station.findOne({stationId: station.label});
        if (!existingStation) {
          const newStation = new Station({
            stationId: station.label,
            xPos: station.x,
            yPos: station.y,
            mapId: newMap._id
          })
          newStation.save()
        }
      }
    
      return res.status(200).json({
        status: true,
        message: "Successfully uploaded!"
      });
    })
  }

  GetMap = async (req:Request, res:Response) => {
    const maps = await Map.find()
    return res.status(200).json({
      status: true,
      mapUrl: maps[0]?.mapUrl
    });
  }
}