import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../APIs/axios';
import Header from '../components/Header';
import toast, { Toaster } from 'react-hot-toast';

function ConfirmBookingPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { floor, table } = state || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    number_of_people: 1,
    date_to_come: '',
    time_to_come: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.loading('Submitting your booking...');
    try {
      const response = await API.post('/bookings/create', {
        ...formData,
        floor,
        table_type: table,
      });

      toast.dismiss();
      toast.success('Booking successful!');
      setLoading(false);
      navigate('/booking-summary', { state: response.data });
    } catch (error) {
      console.error('Booking failed', error);
      toast.dismiss();
      toast.error('Booking failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
        <div className="max-w-full w-[800px] bg-white border border-gray-200 p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Confirm Your Booking
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 text-base">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                name="name"
                required
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:outline-none"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                required
                onChange={handleChange}
                placeholder="example@mail.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:outline-none"
                disabled={loading}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                name="phone"
                required
                onChange={handleChange}
                placeholder="+1234567890"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:outline-none"
                disabled={loading}
              />
            </div>

            {/* Number of People */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of People</label>
              <input
                name="number_of_people"
                type="number"
                min="1"
                required
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:outline-none"
                disabled={loading}
              />
            </div>

            {/* Date and Time */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  name="date_to_come"
                  type="date"
                  required
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:outline-none"
                  disabled={loading}
                />
              </div>

              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  name="time_to_come"
                  type="time"
                  required
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:outline-none"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea
                name="description"
                rows="3"
                placeholder="Any special requests?"
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:outline-none"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition flex justify-center items-center ${
                loading ? 'cursor-not-allowed opacity-60' : ''
              }`}
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : null}
              {loading ? 'Submitting...' : 'Submit Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ConfirmBookingPage;

