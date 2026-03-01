import axios from 'axios';
import { supabase } from '../lib/supabase';

const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach the current session token
api.interceptors.request.use(
  async (config) => {
    // Priority 1: Check if already set
    if (config.headers.Authorization) {
      return config;
    }

    // Priority 2: Check Supabase session
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
            return config;
        }
    } catch (e) {
        // Fallback to localStorage
    }

    // Priority 3: Check local storage (fallback if Supabase client is buggy/failing)
    const fallbackToken = localStorage.getItem('token');
    if (fallbackToken) {
        config.headers.Authorization = `Bearer ${fallbackToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
