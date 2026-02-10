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
  const { slug } = useParams<{ slug: string }>();
  // Here, the "slug" is the entire path after the domain.
  // For example, for valentine.micro-saas.online/my-valentine, slug will be "my-valentine"
  // We need to extract the slug from the path.
  // We will pass the pathname as a slug to ValentinePage.
  const pathname = window.location.pathname.slice(1);

  return <ValentinePage slug={pathname} />;
}

const PdfToTextSubdomainApp = () => {
  return <PdfToTextConverterPage />;
}

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
  // Use a regex to handle localhost and production domains
  const match = hostname.match(/^(?:(.*?)\.)?(?:.*?)\.(?:.*)$/);
  const subdomain = (match && match[1] && !['www', 'localhost'].includes(match[1])) ? match[1] : null;

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