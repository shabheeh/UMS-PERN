import axios from 'axios';
import { signOut } from '../redux/features/authSlice.js';
import { store } from '../redux/app/store'; 
import Cookies from 'js-cookie';

// Create axios instance
const instance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true, 
});

// Interceptor to handle expired access tokens
instance.interceptors.response.use(
  (response) => response, // Success handler
  async (error) => {
    const originalRequest = error.config;
    
    // Check if the error is due to an expired access token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const refreshResponse = await instance.post(
          '/refresh-token', 
          {}, 
          { withCredentials: true } // Ensures cookies are sent with the request
        );

        // Update access token
        const newAccessToken = refreshResponse.data.accessToken;
        Cookies.set('accessToken', newAccessToken, { expires: 7, secure: true, sameSite: 'None' });
        instance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return instance(originalRequest); // Retry the original request
      } catch (refreshError) {

        store.dispatch(signOut()); 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
