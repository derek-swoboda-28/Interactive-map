import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const DrawMachine = () => {
  const navigate = useNavigate();
  return (
    <div className="text-black max-w-[1024px] m-auto py-12 max-[1044px]:px-2.5">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <FaArrowLeft size={20} />
        <div className="text-lg">Back to Home</div>
      </div>
      <div className="text-green-500 text-center text-3xl font-semibold mb-8 mt-16">Upload a Map & Add Stations</div>
    </div>
  )
}

export default DrawMachine