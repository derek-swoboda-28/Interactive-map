import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import Home from "../pages/Home";
import Stations from "../pages/Stations";
import Machine from "../pages/Machine";
import EnterId from "../pages/EnterId";
import AllStations from "../pages/AllStations";
import AllMachines from "../pages/AllMachines";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stations" element={<Stations />} />
        <Route path="/machine" element={<Machine />} />
        <Route path="/enter" element={<EnterId />} />
        <Route path="/allStations" element={<AllStations />} />
        <Route path="/allMachines" element={<AllMachines />} />
        <Route path="*" element={<>ERROR</>} />
      </Routes>
    </Router>
  )
};

export default AppRouter;