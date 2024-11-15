import axios from 'axios';
import { signOut } from '../redux/features/authSlice.js';
import { store } from '../redux/app/store';

// In-memory token storage
let accessToken: string | null = null;

// Create axios instance
const instance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true, // Keep this for refresh token cookie
});

// Function to set access token (call this after login)
export const setAccessToken = (token: string) => {
  accessToken = token;
  localStorage.setItem('accessToken', token); // Save token to localStorage
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Function to clear access token (call this during logout)
export const clearAccessToken = () => {
  accessToken = null;
  localStorage.removeItem('accessToken'); // Remove token from localStorage
  delete instance.defaults.headers.common['Authorization'];
};

// Request interceptor to add token to all requests
instance.interceptors.request.use(
  (config) => {
    accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const refreshResponse = await instance.post('/refresh-token');
        
        // Store new access token in memory
        const newAccessToken = refreshResponse.data.accessToken;
        setAccessToken(newAccessToken);

        // Retry the original request with new token
        return instance(originalRequest);
      } catch (refreshError) {
        // Clear token and trigger logout
        clearAccessToken();
        store.dispatch(signOut());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;