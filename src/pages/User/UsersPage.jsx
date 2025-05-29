import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import Sidebar from '../../components/Sidebar';
import UsersList from '../../components/UsersList';
import API from '../../APIs/axios';



const UsersPage = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [user, setUser] = useState(null);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/users/me');
        setUser(res.data);
      } catch (err) {
        console.error('User not authenticated or error:', err.response?.data);
        // Optional: Redirect to login
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="grid-container bg-white">
      <DashboardHeader user={user} OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <UsersList/>

      <main className="main-content p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default UsersPage;