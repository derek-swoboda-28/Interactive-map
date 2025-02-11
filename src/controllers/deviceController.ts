import Device from "@models/Devices";
import Station from "@models/Stations";
import Map from "@models/Maps";
import { Request, response, Response } from "express";

export class DeviceController {
  SearchMachine = async (req: Request, res: Response) => {
    const { machineId } = req.body;
    const existingDevice = await Device.find({ machineId: machineId });
    if (existingDevice.length > 0) {
      return res.status(200).json({
        status: true,
        message: "This machine is already assigned to the following devices",
        devices: existingDevice,
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "Machine is not assiged, Please assign to device",
      });
    }
  };

  AddNewDevice = async (req: Request, res: Response) => {
    const { deviceId, machineId, stationId } = req.body;
    const existingDevice = await Device.findOne({ deviceId: deviceId });
    const currentStation = await Station.findOne({ stationId: stationId });
    if (existingDevice) {
      await Device.findOneAndUpdate(
        { deviceId: deviceId },
        { machineId: machineId, stationId: currentStation?._id },
        { new: true }
      );
      return res.status(200).json({
        status: true,
        message: "Machine Id is updated!",
      });
    } else {
      const newTempDevice = new Device({
        deviceId: deviceId,
        machineId: machineId,
        stationId: currentStation?._id,
      });
      newTempDevice.save();

      return res.status(200).json({
        status: true,
        message: "New device is created successfully!",
      });
    }
  };

  FineMachine = async (req: Request, res: Response) => {
    const { machineId } = req.body;

    const existingDevice = await Device.findOne({ machineId: machineId });
    if (existingDevice) {
      const maps = await Map.find();
      const station = await Station.findById(existingDevice.stationId);
      return res.status(200).json({
        status: true,
        message: "You can see your device in this map.",
        mapUrl: maps[0]?.mapUrl,
        station: {
          xPos: station?.xPos,
          yPos: station?.yPos,
          id: station?.stationId,
        },
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "Not Found.",
      });
    }
  };

  GetMachineByStationId = async (req: Request, res: Response) => {
    const { stationId } = req.body;
    const devices = await Device.find({ stationId: stationId });
    return res.status(200).json({
      status: true,
      devices: devices,
    });
  };

  UpdateDevice = async (req: Request, res: Response) => {
    const {
      stationId,
      machineId,
      deviceId,
      batteryLevel,
      batteryVoltage,
      wakeupCnt,
      rssi,
    } = req.body;
    const existinStation = await Station.findOne({stationId: stationId})
    if (!existinStation) {
      return res.status(304).json({
        status: false,
        message: "Not Station Here!"
      });
    }
    
    const existingDevice = await Device.findOne({deviceId: deviceId})
    if (existingDevice) {
      const tempData = {
        stationId: existinStation._id,
        machineId: machineId,
        batteryLevel: parseFloat(batteryLevel),
        batteryVoltage: parseFloat(batteryVoltage),
        wakeupCnt: parseFloat(wakeupCnt),
        rssi: parseFloat(rssi)
      }
      const updatedDevice = await Device.findOneAndUpdate({ deviceId: deviceId }, tempData, {new: true})
      return res.status(200).json({
        status: true,
        message: "Station is updated successfully!",
        updatedStation: updatedDevice
      });
    } else {
      return res.status(304).json({
        status: false,
        message: "Not Device Here!"
      });
    }
  };
}
