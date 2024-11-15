import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { User, Edit, Mail, Phone, Save, X } from 'lucide-react';
import Navbar from "../../components/user/Navbar";
import { RootState } from "../../redux/app/store";
import axios from "../../utils/axiosInterceptor";

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.profile);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(user || {
    name: "",
    email: "",
    phone: "",
    imageURL: ""
  });

  const [editData, setEditData] = useState({ ...userData });
  const fileInputRef = useRef(null);

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
    axios.put('/profile', userData)
    // .then(res => {
        // if(res.status === 200) {
        //     const user = res.data.user
        // }
    // })
  };

  const handleCancel = () => {
    setEditData({ ...userData });
    setIsEditing(false);
  };

  const handleProfileImageChange =  async(event: React.ChangeEvent<HTMLInputElement>) => {
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

      
      setEditData({ ...editData, imageURL: data.secure_url, });

      
    } catch (error) {
      console.error('Upload error:', error);
     
    }
  };

  

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                {editData.profilePicture ? (
                  <img src={editData.profilePicture} alt="Profile" className="object-cover h-full w-full" />
                ) : (
                  <span>{editData.name ? editData.name.charAt(0) : "?"}</span>
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
                  <span className="text-gray-700">{userData.name || "Name not provided"}</span>
                )}
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{userData.email}</span>
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
                  <span className="text-gray-700">{userData.phone || "Phone not provided"}</span>
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
