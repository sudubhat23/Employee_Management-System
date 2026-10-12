import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ViewEmployee from "./pages/ViewEmployee";
import AddEmployee from "./pages/AddEmployee";
import UpdateEmployee from "./pages/UpdateEmployee";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./AuthContext";
import ProtectedRoutes from "./components/ProtectedRoutes";
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
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<ViewEmployee />} />
            <Route path="/add-employee" element={<AddEmployee />} />
            <Route path="/addEmp" element={<Navigate to="/add-employee" replace />} />
            <Route path="/update-employee/:id" element={<UpdateEmployee />} />
            <Route path="/updateEmp/:empid" element={<UpdateEmployee />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
