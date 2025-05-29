import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import Sidebar from '../../components/Sidebar';
import Home from '../../components/Home';
import LogoutButton from '../../components/LogoutPage';
import API from '../../APIs/axios';
import '../dashboard/DashboardPage.css';

const DashboardPage = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ This must be defined before it's used
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/users/me');
        console.log('User data:', res.data); // 🔍 Check what's returned
        setUser(res.data.user || res.data);  // Adjust depending on API response
      } catch (err) {
        console.error('User not authenticated:', err.response?.data);
      }
    };
  
    fetchUser();
  }, []);
  return (
    <div className="grid-container bg-white">
      <DashboardHeader user={user} OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <Home />
      <LogoutButton />
      <main className="main-content p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardPage;

