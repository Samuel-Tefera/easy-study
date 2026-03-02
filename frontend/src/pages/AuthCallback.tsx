import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { authService } from '../services/auth.service';
import { useAuth } from '../context/useAuth';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { syncUser } = useAuth();
    const hasRun = useRef(false);

    const completeSignIn = async (accessToken: string) => {
        try {
            const { user: appUser } = await authService.registerSession(accessToken);
            syncUser(appUser, accessToken);
            navigate('/dashboard', { replace: true });
        } catch (err) {
            navigate('/login', { replace: true });
        }
    };

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const handleAuth = async () => {
            const hash = window.location.hash;
            if (hash) {
                const params = new URLSearchParams(hash.substring(1));
                const accessToken = params.get('access_token');
                const refreshToken = params.get('refresh_token');

                if (accessToken) {
                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken || '',
                    });

                    if (error) {
                        console.error('[AuthCallback] setSession error:', error.message);
                    }

                    await completeSignIn(accessToken);
                    return;
                }
            }

            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token) {
                await completeSignIn(session.access_token);
                return;
            }

            setTimeout(() => {
                if (window.location.pathname === '/auth/callback') {
                    navigate('/login', { replace: true });
                }
            }, 3000);
        };

        handleAuth();
    }, [navigate, syncUser]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground font-medium">Completing sign in…</span>
            </div>
        </div>
    );
};

export default AuthCallback;
