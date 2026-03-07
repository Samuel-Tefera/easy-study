import { useNavigate } from 'react-router-dom';
import { RotateCcw, Home } from 'lucide-react';
import { Button } from '../components/ui';

interface ErrorPageProps {
    error?: Error | null;
    resetError?: () => void;
}

const ErrorPage = ({ error, resetError }: ErrorPageProps) => {
    const navigate = useNavigate();

    const handleTryAgain = () => {
        if (resetError) {
            resetError();
        } else {
            window.location.reload();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-destructive/8 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md mx-4 animate-fade-in-up relative z-10">
                <div className="flex flex-col items-center text-center">

                    <h1 className="text-2xl font-semibold text-foreground tracking-tight mb-2">
                        Something Went Wrong
                    </h1>
                    <p className="text-muted-foreground leading-relaxed mb-4 max-w-sm">
                        An unexpected error occurred. Don't worry — you can try again or head back home.
                    </p>

                    {/* Error details (dev-friendly) */}
                    {error?.message && (
                        <div className="w-full bg-surface border border-border rounded-xl p-4 mb-8">
                            <p className="text-xs text-muted-foreground font-mono break-all leading-relaxed">
                                {error.message}
                            </p>
                        </div>
                    )}

                    {!error?.message && <div className="mb-4" />}

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/')}
                            icon={<Home className="w-4 h-4" />}
                        >
                            Back to Home
                        </Button>
                        <Button
                            onClick={handleTryAgain}
                            icon={<RotateCcw className="w-4 h-4" />}
                        >
                            Try Again
                        </Button>
                    </div>
                </div>

                <p className="text-xs text-muted-foreground/40 text-center mt-12">
                    © {new Date().getFullYear()} Easy Study
                </p>
            </div>
        </div>
    );
};

export default ErrorPage;
