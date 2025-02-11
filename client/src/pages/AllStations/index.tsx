import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { apis } from "../../apis";
import { useSnackbar } from "notistack";

const AllStations = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mapUrl, setMapUrl] = useState("")
  const [allStations, setAllStations] = useState([
    {
      xPos: 0,
      yPos: 0,
      stationId: 0,
      battery: {
        level: 0, 
        voltage: 0,
        description: ""
      },
      rssi: 0,
      wakeupCnt: 0
    }
  ])
  const [tooltip, setTooltip] = useState<any>(null);
  const [tooltipData, setTooltipData] = useState<any>({
    battery: {
      level: 0,
      voltage: 0,
      description: ""
    }, 
    rssi: 0
  })
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchMap = async () => {
      const response: any = await apis.GetMap()
      try {
        if (response.status) {
          setMapUrl(response.mapUrl)
        }
        const stations: any = await apis.GetAllStations()
        setAllStations(stations.stations)
      } catch (err: any) {
        enqueueSnackbar({
          variant: "error",
          message: "Something is went wrong"
        })
      }
    }

    fetchMap()
  }, [])

  const handleMouseMove = (event: any) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const threshold = 5;
    const nearbyStation: any = allStations.find((station: any) => {
      return (
        Math.abs(station?.xPos - x) < threshold &&
        Math.abs(station?.yPos - y) < threshold
      );
    });
    if (nearbyStation) {
      fetchStation(nearbyStation._id)
      setTooltip({ x: nearbyStation.xPos, y: nearbyStation.yPos });
    } else {
      setTooltip(null);
    }
  };

  const fetchStation = async (stationId: string) => {
    const response: any = await apis.GetStationById({stationId: stationId})
    setTooltip(response.station)
    setTooltipData(response.station)
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && imageLoaded) {
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        // Clear the canvas before drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  
        // Draw each station on the canvas
        allStations.forEach((station: any) => {
          ctx.fillStyle = "red"; // Color of the dot
          ctx.beginPath();
          ctx.arc(station.xPos, station.yPos, 5, 0, Math.PI * 2); // Draw a circle
          ctx.fill();
  
          ctx.fillStyle = "black";
          ctx.font = "12px Arial";
          ctx.fillText(station.stationId, station.xPos + 10, station.yPos - 10);
        });
      }
    }
  }, [allStations, mapUrl, imageLoaded]);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = event.currentTarget;
    setImageDimensions({ width, height });
    setImageLoaded(true);
  };

  return (
    <div className="text-black max-w-[1024px] m-auto py-12 max-[1044px]:px-2.5">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <FaArrowLeft size={20} />
        <div className="text-lg">Back to Home</div>
      </div>
      <div className="text-purple-500 text-center text-3xl font-semibold mb-8 mt-16">Show All Stations</div>
      <div className="flex justify-center relative">
        {
          mapUrl && (
            <div className="relative">
              <img
                src={mapUrl}
                alt="map"
                onMouseMove={handleMouseMove}
                onLoad={handleImageLoad}
                style={{ position: "relative" }}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0"
                width={imageDimensions.width}
                height={imageDimensions.height}
                style={{ pointerEvents: "none" }}
              />
            </div>
          )
        }
        {tooltip && (
          <div
            style={{
              position: 'absolute',
              left: tooltip.x + 30, 
              top: tooltip.y - 10,
              backgroundColor: 'white',
              border: '1px solid black',
              padding: '5px',
              borderRadius: '4px',
              fontSize: '12px',
              width: '150px',
              cursor: 'pointer'
            }}
          >
            <div><span className="font-semibold">Battery Level: </span>{`${tooltipData.battery.level}`}</div>
            <div><span className="font-semibold">Battery description:</span>{`${tooltipData.battery.description}`}</div>
            <div><span className="font-semibold">Battery voltage: </span>{`${tooltipData.battery.voltage.toFixed(2)}`}</div>
            <div><span className="font-semibold">Rssi: </span>{`${tooltipData.rssi}`}</div>
          </div>
          )}
      </div>
      {
        allStations.length > 0 ? <div className="w-full overflow-x-auto flex justify-center">
        <table className="mt-6 max-[600px]:w-[120%]">
          <tbody>
            <tr className="bg-purple-500 text-white">
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
                    <td className="py-1 px-2 border">{station?.battery?.description}</td>
                    <td className="py-1 px-2 border">{station?.battery.level}</td>
                    <td className="py-1 px-2 border">{station?.battery.voltage}</td>
                    <td className="py-1 px-2 border">{station.rssi}</td>
                    <td className="py-1 px-2 border">{station.wakeupCnt}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div> : <div className="text-center text-xl">There are not any stations yet. </div>
      }
      
    </div>
  )
}

export default AllStations;