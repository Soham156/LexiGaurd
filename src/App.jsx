import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './index.css';
import { DocumentProvider } from './context/DocumentContext';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Footer from './components/Footer';

function Layout() {
  const location = useLocation();
  // Show header on all pages except authentication pages
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';
  const showHeader = !isAuthPage;
  const showFooter = location.pathname === '/';

  return (
    <div className="min-h-screen text-gray-800">
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/documents" element={<DashboardPage />} />
        <Route path="/dashboard/chat" element={<DashboardPage />} />
        <Route path="/dashboard/team" element={<DashboardPage />} />
        <Route path="/dashboard/notifications" element={<DashboardPage />} />
        <Route path="/dashboard/settings" element={<DashboardPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <DocumentProvider>
      <Router>
        <Layout />
      </Router>
    </DocumentProvider>
  );
}

export default App;
