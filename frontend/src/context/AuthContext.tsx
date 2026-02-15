import React, { createContext, useContext, useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin, type CodeResponse } from '@react-oauth/google';
import { authService } from '../services/auth.service';
import type { User } from '../types/auth';

interface AuthContextType {
    user: User | null;
    login: () => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse: CodeResponse) => {
            setIsLoading(true);
            try {
                const data = await authService.loginWithGoogle(codeResponse.code);
                setUser(data.user);
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
            } catch (error) {
                console.error('Login Failed:', error);
            } finally {
                setIsLoading(false);
            }
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    const logout = () => {
        googleLogout();
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
