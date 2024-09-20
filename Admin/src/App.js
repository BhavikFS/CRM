import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideBar from "./SideBar";
import Party from "./Party";
import Maintain from "./Maintain";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoutes"; // Import your ProtectedRoute component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/party" element={<ProtectedRoute element={<Party type="party" />} />} />
        <Route path="/subparty" element={<ProtectedRoute element={<Party type="Subparty" />} />} />
        <Route path="/maintain" element={<ProtectedRoute element={<Maintain />} />} />
        <Route path="/sales" element={<ProtectedRoute element={<Party type="Sales" />} />} />
        <Route path="/stock" element={<ProtectedRoute element={<Party type="Stock" />} />} />
        <Route path="/payment" element={<ProtectedRoute element={<Party type="Payment" />} />} />
        <Route path="/purchase" element={<ProtectedRoute element={<Party type="Purchase" />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
