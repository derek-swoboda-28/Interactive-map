import axios, { AxiosHeaders } from "axios";
import { ACCESS_TOKEN } from "../constants"

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

API.interceptors.request.use((config: any) => {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      const mHeaders = AxiosHeaders.from({
        Authorization: `Bearer ${token}`,
      });

      if (mHeaders) {
        config.headers = mHeaders;
      }
    }
  } catch (error) {}

  return config;
});

API.interceptors.response.use(
  (response: any) => {
    return response.data;
  },
  async (error: any) => {
    try {
      if (error.response.status == 401) {
        return Promise.reject(error);
      } else {
        return Promise.reject(error);
      }
    } catch (e) {
      console.log(error);
    }
  }
);

const UploadMap = (data:any) => API.post("/api/v1/map/upload", data)
const GetMap = () => API.get("/api/v1/map/getMap")

// stations
const GetAllStations = () => API.get("/api/v1/station/allStations")
const GetStationById = (data: any) => API.post("/api/v1/station/find", data)

// device
const SearchDevice = (data:any) => API.post("/api/v1/device/search", data)
const HandleDevice = (data:any) => API.post("/api/v1/device/add", data)
const FineMachine = (data:any) => API.post("/api/v1/device/find", data)
const AllDevicesByStationId = (data:any) => API.post("/api/v1/device/allDevices", data)

export const apis = {
  GetAllStations,
  UploadMap,
  GetMap,
  SearchDevice,
  HandleDevice,
  FineMachine,
  AllDevicesByStationId,
  GetStationById
} 