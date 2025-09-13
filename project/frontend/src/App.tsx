import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ApplicantDashboard from './pages/dashboards/ApplicantDashboard';
import MentorDashboard from './pages/dashboards/MentorDashboard';
import RecruiterDashboard from './pages/dashboards/RecruiterDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ChatbotWidget from './components/ChatbotWidget';
import { Toaster } from './components/ui/Toaster';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard/applicant"
                element={
                  <ProtectedRoute role="applicant">
                    <ApplicantDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/mentor"
                element={
                  <ProtectedRoute role="mentor">
                    <MentorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/recruiter"
                element={
                  <ProtectedRoute role="recruiter">
                    <RecruiterDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <ChatbotWidget />
            <Toaster />
          </div>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;