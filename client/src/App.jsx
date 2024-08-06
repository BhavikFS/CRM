import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "./components/Layout/Layout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Layout/Dashboard";
import Login from "./components/pages/Login";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
