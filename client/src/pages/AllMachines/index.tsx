import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { apis } from "../../apis";
import { useSnackbar } from "notistack";

const AllMachines = () => {
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
  const [tooltipData, setTooltipData] = useState<any>(null)
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const fetchMap = async () => {
      const response: any = await apis.GetMap()
      try {
        if (response.status) {
          setMapUrl(response.mapUrl || "")
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
  }, [allStations, mapUrl, imageLoaded])

  const handleMouseMove = (event: any) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const threshold = 10;
    const nearbyStation: any = allStations.find((station: any) => {
      return (
        Math.abs(station?.xPos - x) < threshold &&
        Math.abs(station?.yPos - y) < threshold
      );
    });
    if (nearbyStation) {
      fetchMachines(nearbyStation._id)
      setTooltip({ x: nearbyStation.xPos, y: nearbyStation.yPos });
    } else {
      setTooltip(null);
    }
  };

  const fetchMachines = async (stationId: string) => {
    const response: any = await apis.AllDevicesByStationId({ stationId: stationId })
    setTooltipData(response.devices)
  }

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
      <div className="text-red-500 text-center text-3xl font-semibold mb-8 mt-16">Show All Machines</div>
      <div className="flex justify-center relative">
        {
          mapUrl !== "" && (
            <div className=" relative">
              <img 
                src={mapUrl} 
                alt="map" 
                onMouseMove={handleMouseMove} 
                className="relative" 
                onLoad={handleImageLoad}
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
            {
              tooltipData?.length > 0 ? <div>
                {
                  tooltipData?.map((data:any, index:number) => {
                    return (
                      <div key={index}>
                        <div><span className="font-semibold">DeviceId:</span>{data.deviceId}</div>
                        <div><span className="font-semibold">MachineId:</span>{data.machineId}</div>
                        <hr />
                      </div>
                    )
                  })
                }
              </div> : <div>No devices here</div>
            }
          </div>
        )}
      </div>
    </div>
  )
}

export default AllMachines;