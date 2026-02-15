import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const Login: React.FC = () => {
    const { login, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md w-96 text-center">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Welcome to Easy Study</h1>
                <p className="text-gray-600 mb-8">Sign in to continue to your dashboard</p>

                <button
                    onClick={() => login()}
                    disabled={isLoading}
                    className={`w-full flex items-center justify-center gap-3 px-4 py-2 border border-blue-500 rounded text-blue-500 hover:bg-blue-50 transition-colors ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {isLoading ? (
                        <span>Signing in...</span>
                    ) : (
                        <>
                            <img
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google logo"
                                className="w-6 h-6"
                            />
                            <span>Sign in with Google</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Login;
