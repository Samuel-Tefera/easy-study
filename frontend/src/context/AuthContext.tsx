import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { authService } from '../services/auth.service';
import { AuthContext } from './useAuth';
import type { User } from '../types/auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const syncUser = (userData: User, token: string) => {
        setUser(userData);
        localStorage.setItem('token', token);
        setIsLoading(false);
    };

    useEffect(() => {
        let isMounted = true;

        const registerAndSetUser = async (accessToken: string) => {
            const { user: appUser } = await authService.registerSession(accessToken);
            if (isMounted) {
                setUser(appUser);
            }
        };

        const initAuth = async () => {
            try {
                if (window.location.pathname === '/auth/callback') {
                    return;
                }

                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('[AuthContext] getSession error:', error.message);
                    return;
                }

                if (session?.access_token) {
                    try {
                        await registerAndSetUser(session.access_token);
                    } catch (err) {
                        console.error('[AuthContext] Init sync failed:', err);
                        await supabase.auth.signOut();
                    }
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {

                if (event === 'SIGNED_OUT') {
                    if (isMounted) {
                        setUser(null);
                        localStorage.removeItem('token');
                        setIsLoading(false);
                    }
                } else if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') && session?.access_token) {
                    try {
                        await registerAndSetUser(session.access_token);
                        if (isMounted) {
                            setIsLoading(false);
                        }
                    } catch (err) {
                    }
                }
            }
        );

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
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, syncUser, isAuthenticated: !!user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
