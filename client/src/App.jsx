import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "./components/Layout/Layout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Layout/Dashboard";
import Login from "./components/pages/Login";
import AddItem from "./components/pages/AddItem";
import ProtectedRoutes from "./Utils/ProtectedRoutes";
import History from "./components/pages/History/History";
import Stage3 from "./components/pages/Stage/Stage3";
import Stage4 from "./components/pages/Stage/Stage4";
import PricingCo from "./components/pages/PC/PricingCo";
import PartyData from "./components/pages/History/PartyData";
import GroupData from "./components/pages/History/GroupData";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<ProtectedRoutes element={<Dashboard />} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/addItem" element={<ProtectedRoutes element={<AddItem />} />} />
          <Route path="/history" element={<ProtectedRoutes element={<History />} />} />
          <Route path="/stage" element={<ProtectedRoutes element={<Stage3 />} />} />
          <Route path="/stage4" element={<ProtectedRoutes element={<Stage4 />} />} />
          <Route path="/pending" element={<ProtectedRoutes element={<PricingCo status="pending"/>} />} />
          <Route path="/approved" element={<ProtectedRoutes element={<PricingCo status="approved"/>} />} />
          <Route path="/rejected" element={<ProtectedRoutes element={<PricingCo status="rejected" />} />} />
          <Route path="/ReviewRequired" element={<ProtectedRoutes element={<PricingCo status="ReviewRequired" />} />} />

          <Route path="/partyData" element={<ProtectedRoutes element={<PartyData />} />} />
          <Route path="/grpData" element={<ProtectedRoutes element={<GroupData />} />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
