import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { apis } from "../../apis";
import { useSnackbar } from "notistack";

interface Pin {
  x: number;
  y: number;
  label: string;
}

const Stations = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const mapInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mapImage, setMapImage] = useState<any>(null)
  const [mapOrigin, setMapOrigin] = useState<any>(null)
  const [pins, setPins] = useState<Pin[]>([]);

  const handleMapUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setMapOrigin(file)
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => setMapImage(img); // Store the loaded image
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!mapImage) return;

    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const label = prompt("Enter Station Label:") || "Untitled Station";
      const newPin = { x, y, label };

      setPins((prevPins) => [...prevPins, newPin]);
      drawCanvasWithPins();
    }
  };

  const drawCanvasWithPins = () => {
    const canvas = canvasRef.current;
    if (!canvas || !mapImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the canvas and redraw the image
    canvas.width = mapImage.width;
    canvas.height = mapImage.height;
    ctx.drawImage(mapImage, 0, 0, mapImage.width, mapImage.height);

    // Draw all pins
    pins.forEach((pin) => {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(pin.x, pin.y, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "black";
      ctx.font = "12px Arial";
      ctx.fillText(pin.label, pin.x + 10, pin.y - 10);
    });
  };

  useEffect(() => {
    drawCanvasWithPins();
  }, [pins, mapImage]);

  const handleUploadStations = async () => {
    const formData = new FormData();
    formData.append("image", mapOrigin);
    formData.append("stationId", JSON.stringify(pins));

    const response: any = await apis.UploadMap(formData)
    if (response.status) {
      enqueueSnackbar({
        variant: "success",
        message: response.message
      })
      navigate("/")
    }
  }

  return (
    <div className="text-black max-w-[1024px] m-auto py-12 max-[1044px]:px-2.5">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <FaArrowLeft size={20} />
        <div className="text-lg">Back to Home</div>
      </div>
      <div className="text-green-500 text-center text-3xl font-semibold mb-8 mt-16">Upload a Map & Add Stations</div>
      {mapImage ? (
        <div className="relative">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="border-2 border-gray-300 rounded-lg m-auto"
          />
        </div>
      ) : (
        <div
          className="w-full border-4 border-dashed h-[600px] rounded-lg cursor-pointer flex items-center justify-center"
          onClick={() => mapInputRef.current?.click()}
        >
          <GoPlus size={120} className="text-gray-400" />
          <input
            ref={mapInputRef}
            type="file"
            accept=".png, .jpg, .jpeg"
            className="hidden"
            onChange={handleMapUpload}
          />
        </div>
      )}

      <div className="mt-6 text-right">
        <button
          onClick={handleUploadStations}
          className="bg-green-500 text-white rounded-lg px-8 py-4 hover:bg-green-600"
        >
          Save Stations
        </button>
      </div>
    </div>
  )
}

export default Stations