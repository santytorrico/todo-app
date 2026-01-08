import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuthStore } from "./store/authStore";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
// import { JSX } from "react";
import ForgotPassword from "./pages/ForgotPassword";

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" />;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Navbar>
                <Dashboard />
              </Navbar>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;