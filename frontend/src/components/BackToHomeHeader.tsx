import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackToHomeHeader = () => {
    return (
        <div className="border-b border-border/40 bg-surface/50 backdrop-blur-md sticky top-0 z-10">
            <div className="max-w-3xl mx-auto px-6 h-14 flex items-center">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default BackToHomeHeader;
