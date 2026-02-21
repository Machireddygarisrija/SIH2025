import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

// Dashboard Pages
import StudentDashboard from '@/pages/dashboard/StudentDashboard';
import AdminDashboard from '@/pages/dashboard/AdminDashboard';
import RecruiterDashboard from '@/pages/dashboard/RecruiterDashboard';

// Feature Pages
import ResumeUploadPage from '@/pages/resume/ResumeUploadPage';
import JobRecommendationsPage from '@/pages/jobs/JobRecommendationsPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import AllocationPanelPage from '@/pages/admin/AllocationPanelPage';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/register" 
        element={!user ? <RegisterPage /> : <Navigate to="/dashboard" replace />} 
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {user?.role === 'student' && <StudentDashboard />}
            {user?.role === 'admin' && <AdminDashboard />}
            {user?.role === 'recruiter' && <RecruiterDashboard />}
          </ProtectedRoute>
        }
      />

      <Route
        path="/resume-upload"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <ResumeUploadPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/job-recommendations"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <JobRecommendationsPage />
          </ProtectedRoute>
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
        path="/admin/allocation"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AllocationPanelPage />
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route
        path="/"
        element={
          user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;