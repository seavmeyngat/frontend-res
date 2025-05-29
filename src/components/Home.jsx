import React, { useEffect, useState } from 'react';
import {
  BsFillBasketFill,
  BsCupStraw,
  BsCake2,
  BsCalendarCheck,
  BsBellFill,
  BsPersonFill,
} from 'react-icons/bs';
import FullBookingButton from '../components/button-fullBooking';
function Home() {
  const [foods, setFoods] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [bakeries, setBakeries] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);

  const [today, setToday] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsRes = await fetch('https://pse-restaurant-be.final25.psewmad.org/api/items/getAll');
        const notiRes = await fetch('https://pse-restaurant-be.final25.psewmad.org/api/notifications');
        const bookingRes = await fetch('https://pse-restaurant-be.final25.psewmad.org/api/bookings/getAll');
        const token = localStorage.getItem('token');
        const usersRes = await fetch('https://pse-restaurant-be.final25.psewmad.org/api/users/getAll', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const itemsData = await itemsRes.json();
        const notiData = await notiRes.json();
        const bookingData = await bookingRes.json();
        const usersData = await usersRes.json();

        setFoods(itemsData.filter(item => item.type === 'food'));
        setDrinks(itemsData.filter(item => item.type === 'drink'));
        setBakeries(itemsData.filter(item => item.type === 'bakeries'));
        setNotifications(notiData);
        setBookings(bookingData);
        setUsers(usersData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchData();
  }, []);


  const updateBookingStatus = async (id, status, reason = '') => {
    try {
      await fetch(`https://pse-restaurant-be.final25.psewmad.org/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejection_reason: reason }),
      });
      // Reload bookings
      const updatedBookings = await fetch('https://pse-restaurant-be.final25.psewmad.org/api/bookings/getAll');
      const data = await updatedBookings.json();
      setBookings(data);
    } catch (err) {
      alert('Failed to update booking');
    }
  };

  const todayBookings = bookings.filter(b => b.date_to_come === today);
  const totalToday = todayBookings.length;
  const totalAccepted = todayBookings.filter(b => b.status === 'accepted').length;
  const totalRejected = todayBookings.filter(b => b.status === 'rejected').length;

  const todayDate = new Date();
  const formattedDate = todayDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="main-container p-4 space-y-8">
      <div className="main-title">
        <h3 className="text-2xl font-bold">DASHBOARD</h3>
      </div>

      <div className="main-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card elements (unchanged) */}
        <DashboardCard label="FOODS" count={foods.length} icon={<BsFillBasketFill />} color="green" />
        <DashboardCard label="DRINKS" count={drinks.length} icon={<BsCupStraw />} color="blue" />
        <DashboardCard label="BAKERIES" count={bakeries.length} icon={<BsCake2 />} color="pink" />
        <DashboardCard label="NOTIFICATION" count={notifications.length} icon={<BsBellFill />} color="red" />
        <DashboardCard label="BOOKINGS" count={bookings.length} icon={<BsCalendarCheck />} color="purple" />
        <DashboardCard label="USERS" count={users.length} icon={<BsPersonFill />} color="yellow" />
      </div>

      {/* Booking Section */}


      {/* Current Bookings Table */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-4 text-black">Today's Bookings - {formattedDate}</h3>
        <div className="bg-white p-4 rounded shadow">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-500 p-4 rounded">Total: {totalToday}</div>
            <div className="bg-amber-900 p-4 rounded">Accepted: {totalAccepted}</div>
            <div className="bg-blue-800 p-4 rounded">Rejected: {totalRejected}</div>
          </div>
          <FullBookingButton />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border text-left">
            <thead>
              <tr className="bg-gray-600 text-white">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">People</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings
                .filter(b => b.date_to_come === today)
                .map(b => (
                  <tr key={b.booking_id} className="border-t text-black">
                    <td className="p-2 border text-black">{b.name}</td>
                    <td className="p-2 border text-black">{b.number_of_people}</td>
                    <td className="p-2 border text-black">{b.time_to_come}</td>
                    <td className="p-2 border text-black ">{b.status}</td>
                    <td className="p-2 border text-black space-x-2">
                      <button
                        onClick={() => updateBookingStatus(b.booking_id, 'accepted')}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Enter rejection reason:');
                          if (reason) {
                            updateBookingStatus(b.booking_id, 'rejected', reason);
                          }
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

// Reusable card component
function DashboardCard({ label, count, icon, color }) {
  return (
    <div className={`card bg-${color}-500`}>
      <div className="card-inner">
        <h3 className="text-white">{label}</h3>
        <div className="card_icon text-white text-2xl">{icon}</div>
      </div>
      <h1 className="text-white">{count}</h1>
    </div>
  );
}

export default Home;
