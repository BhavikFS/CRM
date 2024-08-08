import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "./components/Layout/Layout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Layout/Dashboard";
import Login from "./components/pages/Login";
import AddItem from "./components/pages/AddItem";
import ProtectedRoutes from "./Utils/ProtectedRoutes";
import History from "./components/pages/History/History";
import Stage3 from "./components/pages/Stage/Stage3";

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

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
