import SignIn from '../../components/user/SignIn';
import SignUp from '../../components/user/SignUp';

const LoginPage = () => {
  return (
    <div>
      {location.pathname === '/signin' ? <SignIn /> : <SignUp />}
    </div>
  );
};

export default LoginPage;
