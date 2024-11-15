import React, { useRef, useState,  useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, Edit, Mail, Phone, Save, X } from 'lucide-react';
import Navbar from "../../components/user/Navbar";
import { RootState } from "../../redux/app/store";
import axios from "../../utils/axiosInterceptor";
import { setUser } from "../../redux/features/authSlice";
import { Toaster, toast } from "react-hot-toast";
import { validateName, validatePhoneNumber } from "../../utils/inputValidations";

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(user || {
    name: "",
    email: "",
    phone: "",
    imageurl: ""
  });

  const [editData, setEditData] = useState({ ...userData });
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleSave = () => {
    if (editData.name) {
      if(!validateName(editData.name)) {
        return toast.error('please provide valid name');
      }
    }else {
      return toast.error('please provide name');
    }

    if (!editData.phone) {
      return toast.error('please provide phone');
    }

    if (editData.imageurl) {
      if(!validatePhoneNumber(editData.phone)) {
        return toast.error('please provide valid phone')
      }
    }else {
      return toast.error('please provide image');

    }

    setUserData(editData);
    setIsEditing(false);

    axios.put('/profile', editData)
      .then((res) => {
        if (res.status === 200) {
          const { user } = res.data;

          // Update the user in Redux
          dispatch(setUser(user));

          // Notify the user of success
          toast.success('Profile updated successfully');
        }
      })
      .catch((err) => {
        console.error('Error editing profile:', err);

        // Display error message
        if (err.response?.data?.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error('An error occurred while editing the profile');
        }
      });
  };

  const handleCancel = () => {
    setEditData({ ...userData });
    setIsEditing(false);
  };

  const handleProfileImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'dih8zu3u');

      const response = await fetch(`https://api.cloudinary.com/v1_1/dvhwjy5mn/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setEditData({ ...editData, imageurl: data.secure_url });
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Update the user state when the userData state changes
  useEffect(() => {
    setUser(userData);
  }, [userData, setUser]);



  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex justify-center relative">
              <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-bold">
                {editData.imageurl ? (
                  <img src={editData.imageurl} alt="Profile" className="object-cover h-full w-full" />
                ) : (
                  <span>{user?.name ? user.name.charAt(0) : "?"}</span>
                )}
                {isEditing && (
                  <button
                    onClick={triggerFileInput}
                    className="absolute bottom-2 right-2 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-800"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </div>

            {/* User Information */}
            <div className="space-y-4">
              {/* Name */}
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name || ""}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="flex-1 p-2 border rounded-lg"
                    placeholder="Enter your name"
                  />
                ) : (
                  <span className="text-gray-700">{user?.name || "Name not provided"}</span>
                )}
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{user?.email}</span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone || ""}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="flex-1 p-2 border rounded-lg"
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <span className="text-gray-700">{user?.phone || "Phone not provided"}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
