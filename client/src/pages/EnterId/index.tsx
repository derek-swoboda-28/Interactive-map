import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { apis } from "../../apis";
import { useSnackbar } from "notistack";

const EnterId = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [machineId, setMachineId] = useState("")
  const [deviceId, setDeviceId] = useState("")
  const [stationId, setStationId] = useState("")
  const [allStations, setAllStations] = useState([])

  useEffect(() => {
    const fetchStations = async () => {
      const stations: any = await apis.GetAllStations()
      setAllStations(stations.stations)
    }
    fetchStations()
  }, [])

  const handleSubmitDevice = async () => {
    const existingStationId = allStations.filter((station:any) => station.stationId === stationId)
    if (existingStationId.length === 0) {
      return enqueueSnackbar({
        variant: "info",
        message: "Please only existing Station Id"
      })
    }
    const info = {
      machineId,
      deviceId,
      stationId
    }
    const response: any = await apis.HandleDevice(info)
    try {
      if (response.status) {
        enqueueSnackbar({
          variant: "success",
          message: response.message
        })
        setMachineId("")
        setDeviceId("")
        setStationId("")
      }
    } catch (err: any) {
      enqueueSnackbar({
        variant: "error",
        message: "Something is went wrong"
      })
    }
  }

  return (
    <div className="text-black max-w-[1024px] m-auto py-12 max-[1044px]:px-2.5">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <FaArrowLeft size={20} />
        <div className="text-lg">Back to Home</div>
      </div>
      <div className="text-orange-500 text-center text-3xl font-semibold mb-8 mt-16">Enter Machine Id & Device Id</div>
      <div className="max-w-[400px] m-auto">
        <div>
          <div>Machine Id*</div>
          <input
            type="text"
            placeholder="Enter Machine ID"
            onChange={(e) => setMachineId(e.target.value)}
            value={machineId}
            className="border px-4 py-2 rounded-[5px] outline-none w-full"
          />
        </div>
        <div className="mt-3">
          <div>Device Id*</div>
          <input
            type="text"
            placeholder="Enter Device ID"
            onChange={(e) => setDeviceId(e.target.value)}
            value={deviceId}
            className="border px-4 py-2 rounded-[5px] outline-none w-full"
          />
        </div>
        <div className="mt-3">
          <div>Enter only available stations*</div>
          <input
            type="text"
            placeholder="Enter Device ID"
            onChange={(e) => setStationId(e.target.value)}
            value={stationId}
            className="border px-4 py-2 rounded-[5px] outline-none w-full"
          />
        </div>
        
        <div className="flex justify-center mt-6">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-[5px]"
            onClick={() => handleSubmitDevice()}
          >
            Submit
          </button>
        </div>
        
      </div>
      {
        allStations.length > 0 ? <div className="w-full overflow-x-auto flex justify-center">
        <table className="mt-6 max-[600px]:w-[120%]">
          <tbody>
            <tr className="bg-orange-500 text-white">
              <th className=" px-3 py-2 border">No</th>
              <th className=" px-3 py-2 border">Station Id</th>
              <th className=" px-3 py-2 border">Battery Description</th>
              <th className=" px-3 py-2 border">Battery Level</th>
              <th className=" px-3 py-2 border">Battery Voltage</th>
              <th className=" px-3 py-2 border">Rssi</th>
              <th className=" px-3 py-2 border">Wakeup Cnt</th>
            </tr>
            {
              allStations?.map((station: any, index: number) => {
                return (
                  <tr key={index} className="text-center">
                    <td className="py-1 px-2 border">{index+1}</td>
                    <td className="py-1 px-2 border">{station.stationId}</td>
                    <td className="py-1 px-2 border">{station.battery.description}</td>
                    <td className="py-1 px-2 border">{station.battery.level}</td>
                    <td className="py-1 px-2 border">{station.battery.voltage}</td>
                    <td className="py-1 px-2 border">{station.rssi}</td>
                    <td className="py-1 px-2 border">{station.wakeupCnt}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div> : <div className="text-xl text-center mt-4">There are not any stations yet.</div>
      }
      
    </div>
  )
}

export default EnterId