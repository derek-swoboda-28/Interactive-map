import mongoose, { mongo } from "mongoose";

const mapsSchema = new mongoose.Schema({
  mapUrl: {
    type: String
  }
})

const Map = mongoose.model("maps", mapsSchema);

export default Map