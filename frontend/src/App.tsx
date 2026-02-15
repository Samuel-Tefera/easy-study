import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudyRoom from './pages/StudyRoom';

/* ── Loading Screen ── */
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="flex flex-col items-center gap-3 animate-fade-in">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin-slow" />
      <span className="text-sm text-muted-foreground">Loading…</span>
    </div>
  </div>
);

/* ── Protected Route Wrapper ── */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <AppLayout>{children}</AppLayout>;
};

/* ── Routes ── */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/study/:documentId"
        element={
          <ProtectedRoute>
            <StudyRoom />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

/* ── App Root ── */
function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="bg-surface border border-border rounded-xl p-6 max-w-sm text-center shadow-card">
          <h2 className="text-base font-semibold text-foreground mb-2">Configuration Error</h2>
          <p className="text-sm text-muted-foreground">
            Google Client ID is missing. Please check your <code className="text-xs bg-surface-elevated px-1 py-0.5 rounded">.env</code> file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
