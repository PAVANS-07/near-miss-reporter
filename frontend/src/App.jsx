import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Analytics from "./pages/Analytics";
import ReportDetail from "./pages/ReportDetail";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./components/AuthContext";

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Toaster position="top-right" />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          }
        />
        <Route
          path="/report/:id"
          element={
            <PrivateRoute>
              <ReportDetail />
            </PrivateRoute>
          }
        />

        {/* 🔄 Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}