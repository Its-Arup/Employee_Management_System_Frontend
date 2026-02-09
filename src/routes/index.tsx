import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@/pages/LoginPage";
import { RegistrationPage } from "@/pages/RegistrationPage";
import { OTPVerificationPage } from "@/pages/OTPVerificationPage";
import { HomePage } from "@/pages/HomePage";
import { ProtectedRoute } from "@/pages/ProtectedRoute";
import { GuestRoute } from "@/pages/GuestRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegistrationPage />
          </GuestRoute>
        }
      />
      <Route
        path="/verify-otp"
        element={
          <GuestRoute>
            <OTPVerificationPage />
          </GuestRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
