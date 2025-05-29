import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function BookingSummaryPage() {
  const { state: booking } = useLocation();
  const navigate = useNavigate();

  if (!booking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-600 text-lg">
        No booking found.
      </div>
    );
  }
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Booking Summary', 14, 22);
    autoTable(doc, {
      startY: 30,
      body: [
        ['Name', booking.name],
        ['Email', booking.email],
        ['Phone', booking.phone],
        ['Floor', booking.floor],
        ['Table Type', booking.table],
        ['Guests', booking.number_of_people],
        ['Date', booking.date_to_come],
        ['Time', booking.time_to_come],
        ['Description', booking.description || 'N/A'],
      ],
    });
    doc.save('booking-summary.pdf');
  };

  return (
    <div>
      <Header />
    
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full p-8 bg-white rounded-2xl shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <CheckCircle className="text-green-600 w-10 h-10 mr-2" />
          <h2 className="text-3xl font-bold text-gray-800">Booking Confirmed</h2>
        </div>

        <p className="text-center text-gray-600 mb-8">
          Thank you for your reservation! Here are your booking details:
        </p>

        <ul className="space-y-4 text-gray-700 text-lg">
  <li><span className="font-semibold">Name:</span> {booking.name}</li>
  <li><span className="font-semibold">Email:</span> {booking.email}</li>
  <li><span className="font-semibold">Phone:</span> {booking.phone}</li>
  <li><span className="font-semibold">Floor:</span> {booking.floor}</li>
  <li><span className="font-semibold">Table Type:</span> {booking.table}</li>
  <li><span className="font-semibold">Guests:</span> {booking.number_of_people}</li>
  <li><span className="font-semibold">Date:</span> {booking.date_to_come}</li>
  <li><span className="font-semibold">Time:</span> {booking.time_to_come}</li>
  <li><span className="font-semibold">Description:</span> {booking.description || 'N/A'}</li>
  <li>
    <span className="font-semibold">Status:</span>{" "}
    <span
      className={`inline-block px-2 py-1 text-sm rounded ${
        booking.status === 'accepted'
          ? 'bg-green-100 text-green-700'
          : booking.status === 'rejected'
          ? 'bg-red-100 text-red-700'
          : 'bg-yellow-100 text-yellow-700'
      }`}
    >
      {booking.status}
    </span>
  </li>
  {booking.status === 'rejected' && (
    <li>
      <span className="font-semibold">Rejection Reason:</span>{" "}
      {booking.rejection_reason || 'N/A'}
    </li>
  )}
</ul>


        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 mb-6">We look forward to welcoming you!</p>
          <button
            onClick={() => navigate('/booking')}
            className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition"
          >
            Make Another Booking
          </button>
          <button
  onClick={generatePDF}
  className=" ml-20 mt-4 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
>
  Download Summary
</button>

        </div>
      </div>
    </div>
    </div>
  );
}

export default BookingSummaryPage;

