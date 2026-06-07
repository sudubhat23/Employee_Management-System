import React from "react";
import NavbarComp from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ViewEmployee from "./pages/ViewEmployee";
import AddEmployee from "./pages/AddEmployee";
import UpdateEmployee from "./pages/UpdateEmployee";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./AuthContext";
import ProtectedRoutes from "./components/ProtectedRoutes";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavbarComp />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<ProtectedRoutes><ViewEmployee /></ProtectedRoutes>} />
          <Route path="/addEmp" element={<ProtectedRoutes><AddEmployee /></ProtectedRoutes>} />
          <Route path="/updateEmp/:empid" element={<ProtectedRoutes><UpdateEmployee /></ProtectedRoutes>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
