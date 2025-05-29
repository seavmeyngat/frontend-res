import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-1 py-1.5  hover:bg-red-700"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
