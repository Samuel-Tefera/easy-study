import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudyRoom from './pages/StudyRoom';
import Landing from './pages/Landing';
import AuthCallback from './pages/AuthCallback';

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

/* ── Protected Route (No Layout — full-screen) ── */
const ProtectedRouteNoLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

/* ── Routes ── */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Landing />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/study/:id"
        element={
          <ProtectedRouteNoLayout>
            <StudyRoom />
          </ProtectedRouteNoLayout>
        }
      />
    </Routes>
  );
}

/* ── App Root ── */
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
