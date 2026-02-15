export interface User {
    id: string;
    email: string;
    name: string;
    picture?: string;
}

export interface LoginCredentials {
    email: string;
    password?: string; // Optional for now since we use Google
}

export interface RegisterCredentials {
    email: string;
    password?: string;
    name: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export interface GoogleAuthRequest {
    code: string;
    code_verifier?: string;
    redirect_uri?: string;
}
