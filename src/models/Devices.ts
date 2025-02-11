import mongoose from "mongoose";
import Station from "./Stations";

const deviceschema = new mongoose.Schema({
  stationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Station,
    default: null
  },
  deviceId: {
    type: String, 
  },
  machineId: {
    type: String, 
    default: null
  },
  customerId: {
    type: String,
    default: null,
  },
  timestamp: {
    type: Number,
    default: Date.now,
  },
  batteryLevel: {
    type: Number,
    default: 0
  },
  batteryVoltage: {
    type: Number,
    default: 0
  },
  wakeupCnt: {
    type: Number,
    default: 0
  },
  rssi: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Device = mongoose.model("devices", deviceschema);

export default Device;