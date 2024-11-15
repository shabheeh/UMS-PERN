import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/app/store';
import Navbar from '../../components/user/Navbar';


const Home = () => {
  const name = useSelector((state: RootState) => state.auth.user?.name ? state.auth.user.name : 'User')

  return (
    <div className="min-h-screen">
        <Navbar />
      <div 
        className="min-h-[calc(100vh-64px)] bg-cover bg-center flex items-center justify-center"
        
      >
        <div className="text-center text-black">
          <h1 className="text-5xl font-bold mb-4">Welcome Back</h1>
          <p className="text-3xl font-light">{name}</p>
        </div>
      </div>
    </div>
  );
};

// Profile Page Component


export default Home;