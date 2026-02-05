import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@/components/LoginPage";
import { RegistrationPage } from "@/components/RegistrationPage";
import { OTPVerificationPage } from "@/components/OTPVerificationPage";

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
