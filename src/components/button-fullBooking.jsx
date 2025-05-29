// button-fullBooking.jsx
import API from '../APIs/axios';

const FullBookingButton = () => {
  const handleFullBooking = async () => {
    const confirm = window.confirm("Are you sure you want to mark the restaurant as fully booked?");
    if (!confirm) return;

    try {
      const res = await API.post('/notifications/fullbooking', {});
      alert(res.data.message || 'Full booking notification created successfully.');
    } catch (err) {
      console.error('Full booking error:', err.response || err);
      alert(err.response?.data?.details || err.response?.data?.error || 'Failed to create full booking notification');
    }
  };

  return (
    <button
      onClick={handleFullBooking}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Full Booking
    </button>
  );
};

export default FullBookingButton;