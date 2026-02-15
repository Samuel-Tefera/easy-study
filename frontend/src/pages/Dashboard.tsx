import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const token = localStorage.getItem('token');

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {user && (
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-6">
                            {user.picture && (
                                <img
                                    src={user.picture}
                                    alt={user.name}
                                    className="w-16 h-16 rounded-full"
                                />
                            )}
                            <div>
                                <h2 className="text-xl font-semibold">{user.name}</h2>
                                <p className="text-gray-600">{user.email}</p>
                            </div>
                        </div>

                        <div className="bg-gray-100 p-4 rounded overflow-x-auto">
                            <h3 className="font-semibold mb-2">JWT Token:</h3>
                            <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all">
                                {token}
                            </pre>
                        </div>
                    </div>
                )}

                <div className="bg-gray-100 p-4 rounded mt-4">
                     <h3 className="font-semibold mb-2">User Object:</h3>
                     <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(user, null, 2)}
                     </pre>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
