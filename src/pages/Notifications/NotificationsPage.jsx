import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import Sidebar from '../../components/Sidebar';
import Notifications from '../../components/Notification';
import API from '../../APIs/axios';



const NotificationsPage = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [user, setUser] = useState(null);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/users/me');
        console.log('User data:', res.data); 
        setUser(res.data.user || res.data);
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
      <Notifications/>

      <main className="main-content p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default NotificationsPage;