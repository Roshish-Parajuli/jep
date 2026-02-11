import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ValentinePage from './pages/ValentinePage';
import HomePage from './pages/HomePage';
import PdfToTextConverterPage from './pages/PdfToTextConverterPage';
import ComingSoonPage from './pages/ComingSoonPage';

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
        <Route path="/coming-soon" element={<ComingSoonPage />} />
        {/* Fallback for unmatched routes */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;