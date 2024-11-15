import { User } from 'lucide-react';

const Navbar = ({ profilePicture }) => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-7">
            <div className="flex items-center">
              <span className="font-semibold text-lg text-gray-900">Home</span>
            </div>
          </div>
          <div className="flex space-x-4 items-center">
            <a href="/profile" className=" w-10 h-10 rounded-full flex items-center justify-center text-black hover:bg-blue-600">
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="w-full h-full rounded-full" />
              ) : (
                <User className="h-6 w-6" />
              )}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;