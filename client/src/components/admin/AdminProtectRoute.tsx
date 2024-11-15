import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { checkAuth } from '../../utils/authServices';
import { useSelector, useDispatch } from 'react-redux';
import { OrbitProgress } from 'react-loading-indicators';
import { RootState } from '../../redux/app/store';
import { signOut } from '../../redux/features/authSlice';
import Navbar from './Navbar';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState )=> state.auth.isAuthenticated);
  const [isChecking, setIsChecking] = useState(true);

  const dispatch = useDispatch()

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const isValid = await checkAuth();
        
    
        if (!isValid) {
          dispatch(signOut());
        }
      } finally {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, []);

  if (isChecking) {
    return (
      <div className="h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <OrbitProgress variant="disc" color="#000000" size="medium" text="" textColor="" />
      </div>
    </div>
    
    )
  }

  return isAuthenticated ? children : <Navigate to="/signin" />;
};

export default AdminProtectedRoute;