import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@/components/LoginPage";
import { RegistrationPage } from "@/components/RegistrationPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
