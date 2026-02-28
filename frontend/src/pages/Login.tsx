import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from '../components/ui';

const Login: React.FC = () => {
    const { login, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-full max-w-sm mx-4 animate-fade-in-up">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-primary-foreground mb-4 shadow-glow">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                        Welcome to Easy Study
                    </h1>
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                        Your AI-powered document tutor. Sign in to get started.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-surface border border-border rounded-xl p-6 shadow-card">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => login()}
                        isLoading={isLoading}
                        className="w-full"
                        icon={
                            !isLoading ? (
                                <img
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                    alt="Google"
                                    className="w-5 h-5"
                                />
                            ) : undefined
                        }
                    >
                        {isLoading ? 'Signing in…' : 'Sign in with Google'}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
                        By signing in, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>

                {/* Footer */}
                <p className="text-xs text-muted-foreground/40 text-center mt-6">
                    © {new Date().getFullYear()} Easy Study
                </p>
            </div>
        </div>
    );
};

export default Login;
