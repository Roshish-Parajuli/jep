import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ValentinePage from './pages/ValentinePage';
import HomePage from './pages/HomePage';
import PdfToTextConverterPage from './pages/PdfToTextConverterPage';
import ResumeReshaperPage from './pages/ResumeReshaperPage';
import ComingSoonPage from './pages/ComingSoonPage';
import AuthPage from './pages/AuthPage';
import UserDashboardPage from './pages/UserDashboardPage';
import CreateSitePage from './pages/CreateSitePage';
import CreateCardPage from './pages/CreateCardPage';
import GiftLandingPage from './pages/GiftLandingPage';
import GiftCardViewerPage from './pages/GiftCardViewerPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import { UserProtectedRoute } from './components/Auth/UserProtectedRoute';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('isAdminAuthenticated');
    setIsAuthenticated(sessionAuth === 'true');
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading authentication...</div>; // Or a spinner
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/admin" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gifts" element={<GiftLandingPage />} />
        <Route path="/admin" element={<LoginPage />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/valentine/:slug"
          element={
            <ValentinePage />
          }
        />
        <Route path="/pdf-to-text" element={<PdfToTextConverterPage />} />
        <Route path="/resume-reshaper" element={<ResumeReshaperPage />} />
        <Route path="/resume-builder" element={<ResumeBuilderPage />} />

        <Route path="/cards/:id" element={<GiftCardViewerPage />} />



        {/* User Auth Routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <UserProtectedRoute>
              <UserDashboardPage />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/create/site"
          element={
            <UserProtectedRoute>
              <CreateSitePage />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/create/card"
          element={
            <UserProtectedRoute>
              <CreateCardPage />
            </UserProtectedRoute>
          }
        />
        <Route path="/coming-soon" element={<ComingSoonPage />} />
        {/* Fallback for unmatched routes */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;