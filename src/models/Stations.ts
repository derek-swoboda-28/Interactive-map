import mongoose, { mongo } from "mongoose";
import Map from "./Maps";

const stationSchema = new mongoose.Schema({
  stationId: {
    type: String,
  },
  mapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Map,
  },
  xPos: {
    type: Number,
    default: 0
  },
  yPos: {
    type: Number,
    default: 0
  },
  customerId: {
    type: String,
    default: null,
  },
  timestamp: {
    type: Number,
    default: Date.now,
  },
  battery: {
    description: {
      type: String,
      default: "Battery of the device"
    },
    level: {
      type: Number,
      default: 0.0
    },
    voltage: {
      type: Number,
      default: 0.0
    }
  },
  wakeupCnt: {
    type: Number,
    default: 0.0
  },
  deviceCnt: {
    type: Number,
    default: 0
  },
  rssi: {
    type: Number,
    default: 0
  },
  stationCnt: {
    type: Number,
    default: 0
  },
  additionalProperties: {
    type: Boolean,
    default: false
  }
})

const Station = mongoose.model("stations", stationSchema);

export default Station;