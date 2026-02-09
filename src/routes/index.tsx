import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@/pages/LoginPage";
import { RegistrationPage } from "@/pages/RegistrationPage";
import { OTPVerificationPage } from "@/pages/OTPVerificationPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/verify-otp" element={<OTPVerificationPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
