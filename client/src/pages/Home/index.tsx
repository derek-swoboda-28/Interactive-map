import Logo from "../../../public/vite.svg"
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="text-black flex items-center justify-center h-[100vh]">
      <div className="w-[450px] flex flex-col gap-3 max-[450px]:w-full max-[450px]:px-2.5">
        <div className="flex items-center justify-center gap-4 mb-5">
          <img src={Logo} alt="Logo" />
          <div className="text-3xl">TRACK</div>
        </div>
        <div className="bg-green-500 text-white py-3 rounded-lg text-center text-xl cursor-pointer hover:bg-green-600" 
          onClick={() => navigate("/stations")}
        >
          Upload a Map & Add Station
        </div>
        <div className="bg-blue-500 text-white py-3 rounded-lg text-center text-xl cursor-pointer hover:bg-blue-600"
          onClick={() => navigate("/machine")}
        >
          Enter Machine ID and Show Map
        </div>
        <div className="bg-purple-500 text-white py-3 rounded-lg text-center text-xl cursor-pointer hover:bg-purple-600"
          onClick={() => navigate("/allStations")}
        >
          Show All Stations
        </div>
        <div className="bg-red-500 text-white py-3 rounded-lg text-center text-xl cursor-pointer hover:bg-red-600"
          onClick={() => navigate("/allMachines")}
        >
          Show All Machines
        </div>
        <div className="bg-orange-500 text-white py-3 rounded-lg text-center text-xl cursor-pointer hover:bg-orange-600"
          onClick={() => navigate("/enter")}
        >
          Enter Machine ID and Device ID
        </div>
      </div>
    </div>
  )
}

export default Home;