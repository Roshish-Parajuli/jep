import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
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

const ValentineSubdomainApp = () => {
  return (
    <Routes>
      <Route path="/admin" element={<LoginPage />} />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/valentine/:slug" element={<ValentinePage />} />
      <Route path="/:slug" element={<ValentinePage />} />
      <Route path="*" element={<ValentinePage />} />
    </Routes>
  );
};

const PdfToTextSubdomainApp = () => {
  return (
    <Routes>
      <Route path="/admin" element={<LoginPage />} />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<PdfToTextConverterPage />} />
      <Route path="*" element={<PdfToTextConverterPage />} />
    </Routes>
  );
};

const MainApp = () => (
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
)

function App() {
  const hostname = window.location.hostname;

  // Improved subdomain detection
  const parts = hostname.split('.');
  let subdomain = null;

  if (parts.length >= 3) {
    if (parts[0] !== 'www') {
      subdomain = parts[0];
    }
  } else if (parts.length === 2 && hostname.includes('localhost')) {
    subdomain = parts[0];
  }

  console.log('Detected Hostname:', hostname);
  console.log('Detected Subdomain:', subdomain);

  let AppToRender;
  switch (subdomain) {
    case 'valentine':
      AppToRender = ValentineSubdomainApp;
      break;
    case 'pdftotext':
      AppToRender = PdfToTextSubdomainApp;
      break;
    default:
      AppToRender = MainApp;
  }

  return (
    <Router>
      <AppToRender />
    </Router>
  );
}

export default App;