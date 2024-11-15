import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/app/store'; 
import SignIn from '../../components/user/SignIn';
import SignUp from '../../components/user/SignUp';

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = useSelector((state: RootState) => state.auth.user.accessToken); 

  useEffect(() => {
    if (token) {
      navigate('/'); 
    }
  }, [token, navigate]);

  return (
    <div>
      {location.pathname === '/signin' ? <SignIn /> : <SignUp />}
    </div>
  );
};

export default LoginPage;
