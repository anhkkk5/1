import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Component để chọn dashboard dựa trên vai trò
const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return null; // Hoặc redirect về login
  }

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "company":
      return <CompanyDashboard />;
    case "student":
      return <StudentDashboard />;
    default:
      return <div>Role not recognized</div>;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
