import React from "react";
import {
  BsGrid1X2Fill,
  BsBasket3Fill,
  BsCupStraw,
  BsPeopleFill,
  BsListCheck,
  BsImages,
  BsCalendarWeek,
  BsGearFill,
  BsBellFill,
} from "react-icons/bs";
import { Link } from "react-router-dom";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  return (
    <aside
      id="sidebar"
      className={`${openSidebarToggle ? "sidebar-responsive" : ""}`}
    >
       <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
          <span className="text-lg font-semibold">LBTB Restaurant</span>
        </div>
        <span
          className="text-xl cursor-pointer md:hidden"
          onClick={OpenSidebar}
        >
          ✕
        </span>
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <Link to="/dashboard">
            <BsGrid1X2Fill className="icon" /> Dashboard
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/items">
            <BsBasket3Fill className="icon" /> Foods
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/bookings">
            <BsListCheck className="icon" /> Booking
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/users">
            <BsPeopleFill className="icon" /> Users
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/weekly_menu">
            <BsCalendarWeek className="icon" /> Weekly Menu
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/gallerys">
            <BsImages className="icon" /> Gallery
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/restaurant-config">
            <BsGearFill className="icon" /> Restaurant Config
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/notification">
            <BsBellFill className="icon" /> Notifications
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
