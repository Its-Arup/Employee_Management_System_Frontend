import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@/pages/LoginPage";
import { RegistrationPage } from "@/pages/RegistrationPage";
import { OTPVerificationPage } from "@/pages/OTPVerificationPage";
import { ProtectedRoute } from "@/pages/ProtectedRoute";
import { GuestRoute } from "@/pages/GuestRoute";
import { ProfilePage } from "@/pages/ProfilePage";
import { DashboardPage } from "@/pages/DashboardPage";


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
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
