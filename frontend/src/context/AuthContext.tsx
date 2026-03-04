import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { authService } from '../services/auth.service';
import { AuthContext } from './useAuth';
import type { User } from '../types/auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('user');
        try { return stored ? JSON.parse(stored) : null; } catch { return null; }
    });
    const [isLoading, setIsLoading] = useState(() => {
        return !(localStorage.getItem('token') && localStorage.getItem('user'));
    });

    const syncUser = (userData: User, token: string) => {
        setUser(userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsLoading(false);
    };

    const fetchingRef = React.useRef(false);

    useEffect(() => {
        let isMounted = true;

        const initializeUser = async (accessToken: string) => {
            if (fetchingRef.current) return;
            fetchingRef.current = true;

            try {
                const { user: appUser } = await authService.registerSession(accessToken);
                if (isMounted) {
                    setUser(appUser);
                    localStorage.setItem('token', accessToken);
                    localStorage.setItem('user', JSON.stringify(appUser));
                }
            } catch (error) {
                console.error('[AuthContext] registerSession error:', error);
                // Do not forcefully sign out on network/backend error.
                // We trust Supabase's active session state in the browser.
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                    fetchingRef.current = false;
                }
            }
        };

        const initAuth = async () => {
            if (window.location.pathname === '/auth/callback') {
                return;
            }

            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                if (session?.access_token) {
                    await initializeUser(session.access_token);
                } else {
                    if (isMounted) setIsLoading(false);
                }
            } catch (err) {
                console.error('[AuthContext] getSession error:', err);
                if (isMounted) setIsLoading(false);
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (window.location.pathname === '/auth/callback') return;

            if (event === 'SIGNED_OUT') {
                if (isMounted) {
                    setUser(null);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setIsLoading(false);
                }
            } else if (session?.access_token && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
                await initializeUser(session.access_token);
            } else if (event === 'INITIAL_SESSION' && !session) {
                if (isMounted) setIsLoading(false);
            }
        });

        initAuth();

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const login = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/auth/callback',
                queryParams: { prompt: 'consent' },
            },
        });
        if (error) throw error;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, syncUser, isAuthenticated: !!user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
