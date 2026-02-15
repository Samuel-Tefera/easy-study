import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, LogOut } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ── Top Navigation ── */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="flex items-center justify-between h-14 px-4 md:px-6 max-w-7xl mx-auto w-full">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-base font-semibold text-foreground tracking-tight">
              Easy Study
            </span>
          </button>

          {/* Right Side: User + Logout */}
          <div className="flex items-center gap-3">
            {/* User Info */}
            <div className="flex items-center gap-2.5">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-7 h-7 rounded-full ring-1 ring-border"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center">
                  <span className="text-xs font-medium text-accent-foreground">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user?.name}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors duration-200 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
