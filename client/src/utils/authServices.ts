import axios, { setAccessToken, clearAccessToken } from './axiosInterceptor';
import { store } from '../redux/app/store';
import { signIn, signOut, setUser, setAuthState } from '../redux/features/authSlice';
import { User } from '../types/authTypes';


interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export const login = async (credentials: { email: string; password: string }) => {
  try {
    const response = await axios.post<LoginResponse>('/signin', credentials);
    
    if (response.data.success) {
      // Store access token in memory
      setAccessToken(response.data.token);
      
  
      store.dispatch(signIn({
        user: response.data.user,
        isAuthenticated: true
      }));

      store.dispatch(setUser(response.data.user))
      
      return response.data;
    }
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const logout = async () => {
  try {
    await axios.post('/signout');
    clearAccessToken();
    store.dispatch(signOut());
  } catch (error) {
    console.error('Logout error:', error);

    clearAccessToken();
    store.dispatch(signOut());
  }
};

// Function to check if user is authenticated
export const checkAuth = async () => {
  try {
    const response = await axios.get('/authenticate');
    if(response.data.success) {
        const user = response.data.user;
        store.dispatch(setUser(user))
        store.dispatch(setAuthState())

    }
    return response.data.success;

  } catch (error) {
    console.log('error checkAuth', error)
    return false;
  }
};