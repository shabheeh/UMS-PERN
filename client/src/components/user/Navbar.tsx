

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/app/store';
import { User } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../utils/authServices';

const Navbar = () => {
  const imgUrl = useSelector((state: RootState) => state.auth.user?.imageurl);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-7">
            <div className="flex items-center">
              <span className="font-semibold text-lg text-gray-900">Home</span>
            </div>
          </div>
          <div className="flex space-x-10 items-center">
            <a href="/profile" className="w-10 h-10 rounded-full flex items-center justify-center text-black hover:bg-blue-600">
              {imgUrl ? (
                <img src={imgUrl} alt="Profile" className="w-full h-full rounded-full" />
              ) : (
                <User className="h-6 w-6" />
              )}
            </a>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;