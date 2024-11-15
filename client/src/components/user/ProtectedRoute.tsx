import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from '../../utils/axiosInterceptor';
import { OrbitProgress } from 'react-loading-indicators';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = Cookies.get('accessToken'); // Retrieve token from cookies

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          // Send the token to the backend for verification
          const response = await axios.post('/authenticate', { token });

          // If token is valid, grant access to protected route
          if (response.status === 200 && response.data.isValid) {
            setIsAuthenticated(true);
          } else {
            // Token is invalid or expired, remove it from cookies
            Cookies.remove('accessToken');
            setIsAuthenticated(false);
          }
        } catch (error) {
            console.log(error)
          Cookies.remove('accessToken');
          setIsAuthenticated(false);
        }
      } else {
        // If no token is found, remove it from cookies (if it's there) and redirect
        Cookies.remove('accessToken');
        setIsAuthenticated(false);
      }
      setIsLoading(false); // Set loading state to false after verification
    };

    verifyToken();
  }, [token]);

  // If still loading (waiting for the backend response), show loading indicator
  if (isLoading) {
    return <OrbitProgress variant="disc" color="#000000" size="medium" text="" textColor="" />
  }

  // If authenticated, render children (protected content)
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated, redirect to the login page
  return <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
