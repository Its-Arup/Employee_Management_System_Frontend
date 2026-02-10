import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@/pages/LoginPage";
import { RegistrationPage } from "@/pages/RegistrationPage";
import { OTPVerificationPage } from "@/pages/OTPVerificationPage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { GuestRoute } from "@/routes/GuestRoute";
import { ProfilePage } from "@/pages/ProfilePage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ApplyLeavePage } from "@/pages/ApplyLeavePage";
import { MyLeavesPage } from "@/pages/MyLeavesPage";
import { MySalariesPage } from "@/pages/MySalariesPage";
import { PendingUsersPage } from "@/pages/PendingUsersPage";
import { LeaveManagementPage } from "@/pages/LeaveManagementPage";
import { NotFoundPage } from "@/pages/NotFoundPage";


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
      <Route
        path="/leaves/apply"
        element={
          <ProtectedRoute>
            <ApplyLeavePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaves/my-leaves"
        element={
          <ProtectedRoute>
            <MyLeavesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaves/manage"
        element={
          <ProtectedRoute>
            <LeaveManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/salaries"
        element={
          <ProtectedRoute>
            <MySalariesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pending-users"
        element={
          <ProtectedRoute>
            <PendingUsersPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
