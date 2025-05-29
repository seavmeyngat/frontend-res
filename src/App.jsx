import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectAdminRoute from "./components/ProtectRoute";

import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import GalleryPage from "./pages/Gallerypage";
import BookingPage from "./pages/BookingPage";
import ConfirmBooking from "./pages/ConfirmBookingPage";
import BookingSummary from "./pages/SummaryBookingPage";
import AuthForm from "./pages/AuthFormPage";

import DashboardPage from "./pages/dashboard/DashboardPage";
import Users from "./pages/User/UsersPage";
import ItemsPage from "./pages/Items/ItemsPage";
import BookingsPage from "./pages/Bookings/BookingPage";
import GallerysPage from "./pages/Gallerys/GalleryPage";
import Weekly_Menu from "./pages/Weekl_Menu/Weekly_MenuPage";
import RestaurantConfigPage from "./pages/RestaurantConfig/RestaurantonfigsPage";
import NotificationsPage from "./pages/Notifications/NotificationsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/confirm-booking" element={<ConfirmBooking />} />
        <Route path="/booking-summary" element={<BookingSummary />} />
        <Route path="/login" element={<AuthForm />} />

        <Route
          path="/dashboard"
          element={
            <ProtectAdminRoute>
              <DashboardPage />
            </ProtectAdminRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectAdminRoute>
              <Users />
            </ProtectAdminRoute>
          }
        />
        <Route
          path="/items"
          element={
            <ProtectAdminRoute>
              <ItemsPage />
            </ProtectAdminRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectAdminRoute>
              <BookingsPage />
            </ProtectAdminRoute>
          }
        />
        <Route
          path="/gallerys"
          element={
            <ProtectAdminRoute>
              <GallerysPage />
            </ProtectAdminRoute>
          }
        />
        <Route
          path="/weekly_menu"
          element={
            <ProtectAdminRoute>
              <Weekly_Menu />
            </ProtectAdminRoute>
          }
        />
        <Route
          path="/restaurant-config"
          element={
            <ProtectAdminRoute>
              <RestaurantConfigPage />
            </ProtectAdminRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <ProtectAdminRoute>
              <NotificationsPage />
            </ProtectAdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
