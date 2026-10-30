import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AdminPortal from "./pages/AdminPortal";
import EmployeePortal from "./pages/EmployeePortal";
import OfficialCommunication from "./pages/OfficialCommunication";
import AiAssistant from "./pages/AiAssistant";
import ViewEmployee from "./pages/ViewEmployee";
import AddEmployee from "./pages/AddEmployee";
import UpdateEmployee from "./pages/UpdateEmployee";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./AuthContext";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AiCopilotWidget from "./components/AiCopilotWidget";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <main className="pb-5">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoutes><Dashboard /></ProtectedRoutes>} />
            <Route path="/admin" element={<ProtectedRoutes><AdminPortal /></ProtectedRoutes>} />
            <Route path="/my-profile" element={<ProtectedRoutes><EmployeePortal /></ProtectedRoutes>} />
            <Route path="/employee-portal" element={<ProtectedRoutes><EmployeePortal /></ProtectedRoutes>} />
            <Route path="/communication" element={<ProtectedRoutes><OfficialCommunication /></ProtectedRoutes>} />
            <Route path="/ai-assistant" element={<ProtectedRoutes><AiAssistant /></ProtectedRoutes>} />
            <Route path="/employees" element={<ProtectedRoutes><ViewEmployee /></ProtectedRoutes>} />
            <Route path="/add-employee" element={<ProtectedRoutes><AddEmployee /></ProtectedRoutes>} />
            <Route path="/addEmp" element={<Navigate to="/add-employee" replace />} />
            <Route path="/update-employee/:id" element={<ProtectedRoutes><UpdateEmployee /></ProtectedRoutes>} />
            <Route path="/updateEmp/:empid" element={<ProtectedRoutes><UpdateEmployee /></ProtectedRoutes>} />

            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
        {/* Persistent Floating AI Copilot Widget */}
        <AiCopilotWidget />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
