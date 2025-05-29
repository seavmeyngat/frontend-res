import React from 'react';
import { BsList } from 'react-icons/bs';

function DashboardHeader({ user, OpenSidebar }) {
  return (
    <header className="header bg-white justify-center items-end p-4">
      <button className="menu-icon" onClick={OpenSidebar}>
        <BsList className="icon_header" />
      </button>
      <div className="user-info">
        <span>{user?.email || 'Loading...'}</span>
      </div>
    </header>
  );
}

export default DashboardHeader;




