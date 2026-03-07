import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md mx-4 animate-fade-in-up relative z-10">
                <div className="flex flex-col items-center text-center">

                    {/* 404 Badge */}
                    <span className="text-8xl font-bold tracking-tighter bg-gradient-to-br from-primary to-primary/40 bg-clip-text text-transparent mb-4 select-none">
                        404
                    </span>

                    <h1 className="text-2xl font-semibold text-foreground tracking-tight mb-2">
                        Page Not Found
                    </h1>
                    <p className="text-muted-foreground leading-relaxed mb-8 max-w-sm">
                        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                            icon={<ArrowLeft className="w-4 h-4" />}
                        >
                            Go Back
                        </Button>
                        <Button
                            onClick={() => navigate('/')}
                            icon={<BookOpen className="w-4 h-4" />}
                        >
                            Back to Home
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

export default NotFound;
