import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./layout/Dashboard";
import ChangePassword from "./pages/ChangePassword";
import Signup from "./pages/Signup";
import EmployeeDetails from "./pages/EmployeeDetails";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
    
          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/:id"
            element={
              <ProtectedRoute>
                <EmployeeDetails />
              </ProtectedRoute>
            }
          />


          {/* Change Password Page */}
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute> 
            } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
