import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { apis } from "../../apis";
import { useSnackbar } from "notistack";

const Machine = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [machineId, setMachineId] = useState("")
  const [showMap, setShowMap] = useState(false)
  const [mapUrl, setMapUrl] = useState("")
  const [stationData, setStationData] = useState<{ xPos: number; yPos: number; id: string } | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleSubmt = async () => {
    const response: any = await apis.FineMachine({ machineId: machineId })
    try {
      if (response.status) {
        enqueueSnackbar({
          variant: "success",
          message: response.message
        })
        setMapUrl(response.mapUrl)
        setStationData(response.station);
        setShowMap(true)
        setMachineId("")
      } else {
        enqueueSnackbar({
          variant: "info",
          message: response.message
        })
        setMachineId("")
        setShowMap(false)
      }
    } catch (err) {
      enqueueSnackbar({
        variant: "error",
        message: "Something is went wrong"
      })
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx && stationData && imageLoaded) {
        // Clear the canvas and draw the dot
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the red dot
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(stationData.xPos, stationData.yPos, 5, 0, Math.PI * 2);
        ctx.fill();

        // Draw the station ID next to the dot
        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        ctx.fillText(stationData.id, stationData.xPos + 10, stationData.yPos - 10);
      }
    }
  }, [stationData, showMap, imageLoaded]);

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
      <div className="text-blue-500 text-center text-3xl font-semibold mb-8 mt-16">Enter Machine ID & Show Map</div>
      <div className="max-w-[400px] m-auto">
        <div>Machine Id*</div>
        <div className="flex items-center gap-4">
          <input
            value={machineId}
            onChange={(e) => setMachineId(e.target.value)}
            className="border px-4 py-2 rounded-[5px] outline-none w-full mt-1"
            placeholder="Enter Machine ID" />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-[5px]"
            onClick={() => handleSubmt()}
          >
            Submit
          </button>
        </div>
      </div>
      {
        showMap === true && <div className="mt-6 relative w-fit m-auto">
          <img 
            src={mapUrl} 
            alt="map" 
            style={{ position: "relative", zIndex: 1 }} 
            onLoad={handleImageLoad}  
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0"
            width={imageDimensions.width}
            height={imageDimensions.height}
            style={{ pointerEvents: "none", zIndex: 2 }}
          />
        </div>
      }
    </div>
  )
}

export default Machine;