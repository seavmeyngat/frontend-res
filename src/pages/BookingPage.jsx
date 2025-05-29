import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
// import FullBookingButton from '../components/button-fullBooking';

const tables = [
  'Solo Size (1)',
  'Couple Size (2)',
  'Family Size (4-6)',
  'Party Size (6-8)',
  'Group Size (8-10)',
  'VIP'
];

function BookingPage() {
  const [selectedFloor, setSelectedFloor] = useState('Indoor');
  const [selectedTable, setSelectedTable] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Replace this with your actual API URL
    fetch('https://pse-restaurant-be.final25.psewmad.org/api/notifications/getFullbooking')
      .then((res) => res.json())
      .then((data) => {
        setNotification(data); // Assuming the API returns a single notification object
        console.log('Fetched notifications:', data);
      })
      .catch((err) => {
        console.error('Failed to fetch notifications:', err);
      });
  }, []);

  const handleTableSelect = (table) => {
    setSelectedTable(table);
  };

  const handleFloorSelect = (floor) => {
    setSelectedFloor(floor);
    setSelectedTable(null);
  };

  const handleBookNow = () => {
    if (selectedTable) {
      navigate('/confirm-booking', {
        state: {
          floor: selectedFloor,
          table: selectedTable
        }
      });
    }
  };

  return (
    <div className="bg-white min-h-screen font-robotoSerif">
      <Header />
      <div className="flex justify-center items-center mt-10 bg-white">
        <div className="w-full max-w-[1250px] px-4">
          <h2 className="text-2xl font-semibold mb-4 text-black">Choose Capacity :</h2>
          <div className="flex space-x-4 mb-16">
            <div>
              <label htmlFor="indoor-floors" className="mr-2 font-medium">Indoor with Air-con:</label>
              <button
                id="indoor-floors"
                onClick={() => handleFloorSelect('Indoor')}
                className={`px-5 py-4 rounded-lg border-2 focus:outline-none ${selectedFloor === 'Indoor' ? 'bg-green-500 border-green-600 text-white' : 'bg-white border-gray-300 hover:bg-green-500 text-black'
                  }`}>
                Indoor
              </button>
            </div>
            <div>
              <label htmlFor="outdoor-floors" className="mr-2 font-medium">Outdoor with fans:</label>
              <button
                id="outdoor-floors"
                onClick={() => handleFloorSelect('Outdoor')}
                className={`px-5 py-4 rounded-lg border-2 focus:outline-none ${selectedFloor === 'Outdoor' ? 'bg-green-500 border-green-600 text-white' : 'bg-white border-gray-300 hover:bg-green-500 text-black'
                  }`}>
                Outdoor
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-20">
            {tables.map((table) => (
              <button
                key={table}
                onClick={() => handleTableSelect(table)}

                className={`relative p-6 rounded-lg border-2 flex justify-center items-center h-24 bg-white ${
                  selectedTable === table ? 'bg-blue-200 border-green-500 ' : 'bg-gray border-gray-300 hover:bg-green-500 text-black'
                }`}>
                <span className="text-xl text-black">{table}</span>
                <div className={`absolute top-[-0.5rem] left-1/2 transform -translate-x-1/2 -translate-y-full w-12 h-3 ${
                  selectedTable === table ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <div className={`absolute bottom-[-0.5rem] left-1/2 transform -translate-x-1/2 translate-y-full w-12 h-3 ${
                  selectedTable === table ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <div className={`absolute left-[-0.5rem] top-1/2 transform -translate-x-full translate-y-[-50%] w-3 h-12 ${
                  selectedTable === table ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <div className={`absolute right-[-0.5rem] top-1/2 transform translate-x-full translate-y-[-50%] w-3 h-12 ${
                  selectedTable === table ? 'bg-green-500' : 'bg-gray-400'
                }`} />

              </button>
            ))}
          </div>

          {notification && notification.notify_type === "full" ? (
            <div className="flex flex-col items-center justify-center text-black p-6 rounded-xl font-bold text-[20px] shadow text-center leading-relaxed mt-16 bg-yellow-100">
              <div className="text-5xl animate-bounce mb-4">🙏</div>
              <span>{notification.description}</span>
            </div>
          ) : (
            <div className="flex justify-center mt-16">
              <button
                className="bg-black text-white px-8 py-3 rounded-full hover:bg-green-500 disabled:opacity-50"
                disabled={!selectedTable}
                onClick={handleBookNow}>
                Book Now
              </button>
              {/* <FullBookingButton /> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
