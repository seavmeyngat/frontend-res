import React, { useState, useEffect } from "react";
import API from "../APIs/axios";
import toast, { Toaster } from "react-hot-toast";

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filterBookingByDate, setFilterBookingByDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const emptyForm = {
    name: "",
    email: "",
    phone: "",
    number_of_people: "",
    date_to_come: "",
    time_to_come: "",
    description: "",
    table_type: "",
    floor: "",
  };

  const [form, setForm] = useState(emptyForm);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingBooking(null);
  };

  const fetchBookings = async () => {
    const loadingToastId = toast.loading("Loading bookings...");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/bookings/getAll", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data || []);
      toast.dismiss(loadingToastId);
    } catch (err) {
      toast.dismiss(loadingToastId);
      toast.error("Failed to load bookings");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setForm({ ...booking });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const loadingToastId = toast.loading("Creating booking...");
    try {
      const token = localStorage.getItem("token");
      const res = await API.post("/bookings/create", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings((prev) => [...prev, res.data]);
      resetForm();
      toast.dismiss(loadingToastId);
      toast.success("Booking created successfully!");
    } catch (err) {
      toast.dismiss(loadingToastId);
      toast.error("Failed to create booking");
      console.error("Create failed:", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const loadingToastId = toast.loading("Updating booking...");
    try {
      const token = localStorage.getItem("token");
      const res = await API.put(
        `/bookings/updateBy/${editingBooking.booking_id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = res.data;
      setBookings((prev) =>
        prev.map((b) => (b.booking_id === updated.booking_id ? updated : b))
      );
      resetForm();
      toast.dismiss(loadingToastId);
      toast.success("Booking updated successfully!");
    } catch (err) {
      toast.dismiss(loadingToastId);
      toast.error("Failed to update booking");
      console.error("Update failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;
    const loadingToastId = toast.loading("Deleting booking...");
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/bookings/deleteBy/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings((prev) => prev.filter((b) => b.booking_id !== id));
      toast.dismiss(loadingToastId);
      toast.success("Booking deleted successfully!");
    } catch (err) {
      toast.dismiss(loadingToastId);
      toast.error("Failed to delete booking");
      console.error("Delete failed:", err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    let rejection_reason = "";
    if (status === "rejected") {
      rejection_reason = window.prompt(
        "Please provide a reason for rejection:",
        ""
      );
      if (rejection_reason === null) return;
    }
    const loadingToastId = toast.loading("Updating status...");
    try {
      const token = localStorage.getItem("token");
      const res = await API.put(
        `/bookings/${id}/status`,
        { status, rejection_reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = res.data.booking;
      setBookings((prev) =>
        prev.map((b) => (b.booking_id === updated.booking_id ? updated : b))
      );
      toast.dismiss(loadingToastId);
      toast.success("Booking status updated!");
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error("Failed to update status");
      console.error("Status update failed:", error);
    }
  };

  const isNewBooking = (booking) => {
    const today = new Date();
    const createdAt = new Date(booking.createdAt);
    return (
      booking.status === "pending" &&
      createdAt.toDateString() === today.toDateString()
    );
  };

  const filteredBookings = bookings
    .filter((b) =>
      `${b.name} ${b.email} ${b.phone}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((b) => (statusFilter ? b.status === statusFilter : true))
    .filter((b) =>
      filterBookingByDate ? b.date_to_come === filterBookingByDate : true
    );

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedItems = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);
  return (
    <div className="main-container bg-white p-4 rounded shadow">
      <Toaster position="top-right" reverseOrder={false} />

      <h1 className="text-2xl font-bold mb-4 text-black">Bookings</h1>

      {/* Form for Create or Update */}
      <form
        onSubmit={editingBooking ? handleUpdate : handleCreate}
        className="mb-6 bg-gray-100 p-4 rounded"
      >
        <h2 className="text-xl font-semibold mb-4 text-black">
          {editingBooking ? "Edit Booking" : "Create Booking"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
          {/* Name */}
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              placeholder="Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="p-2 border rounded w-full"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="p-2 border rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Phone</label>
            <input
              type="tel"
              placeholder="Phone"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="p-2 border rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Number of People</label>
            <input
              type="number"
              placeholder="Number of People"
              required
              min="1"
              value={form.number_of_people}
              onChange={(e) =>
                setForm({ ...form, number_of_people: e.target.value })
              }
              className="p-2 border rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Date to Come</label>
            <input
              type="date"
              required
              value={form.date_to_come}
              onChange={(e) =>
                setForm({ ...form, date_to_come: e.target.value })
              }
              className="p-2 border rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Time to Come</label>
            <input
              type="time"
              required
              value={form.time_to_come}
              onChange={(e) =>
                setForm({ ...form, time_to_come: e.target.value })
              }
              className="p-2 border rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Table Type</label>
            <select
              value={form.table_type}
              onChange={(e) => setForm({ ...form, table_type: e.target.value })}
              className="p-2 border rounded text-black w-full"
              required
            >
              <option value="">Select Table Type</option>
              <option value="2-Seater">Solo Size (1)</option>
              <option value="4-Seater">Couple Size (2)</option>
              <option value="Family">Family Size (4-6)</option>
              <option value="Party">Party Size (6-8)</option>
              <option value="Group">Group Size (8-10)</option>
              <option value="VIP">VIP</option>
            </select>
          </div>

          {/* Floor */}
          <div>
            <label className="block mb-1">Floor</label>
            <select
              value={form.floor}
              onChange={(e) => setForm({ ...form, floor: e.target.value })}
              className="p-2 border rounded text-black w-full"
              required
            >
              <option value="">Select Floor</option>
              <option value="Indoor">Indoor</option>
              <option value="Outdoor">Outdoor</option>
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block mb-1">Description</label>
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="p-2 border rounded w-full"
              rows={3}
            />
          </div>
        </div>

        <div className="mt-4 flex space-x-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-16 py-2 rounded hover:bg-blue-700"
          >
            {editingBooking ? "Update" : "Create"}
          </button>
          {editingBooking && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Filters */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4 justify-between"> 
        <input
          type="text"
          placeholder="Search by name, email, phone"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border rounded mb-2 md:mb-0 flex text-black md:w-1/3"
        />
        <div className="p-2 gap-3 flex flex-col md:flex-row items-center">
          <label className="text-black">Filter By Date</label>
          <input
            type="date"
            value={filterBookingByDate}
            onChange={(e) => setFilterBookingByDate(e.target.value)}
            className="p-2 border rounded text-black px-8"
          />
        

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border rounded text-black px-8"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-600 text-white">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">People</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Time</th>
              <th className="border p-2">Table</th>
              <th className="border p-2">Floor</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="p-4 text-center text-black">
                  Loading...
                </td>
              </tr>
            ) : paginatedItems.length === 0 ? (
              <tr>
                <td colSpan="11" className="p-4 text-center text-black">
                  No bookings found.
                </td>
              </tr>
            ) : (
              paginatedItems.map((b) => (
                <tr key={b.booking_id}>
                  <td className="p-2 border text-black">
                    <div className="relative inline-block">
                      {isNewBooking(b) && (
                        <span className="absolute -top-4 left-0 text-red-500 text-xs font-semibold">
                          New
                        </span>
                      )}
                      <span>{b.name}</span>
                    </div>
                  </td>
                  <td className="p-2 border text-black">{b.email}</td>
                  <td className="p-2 border text-black">{b.phone}</td>
                  <td className="p-2 border text-black">
                    {b.number_of_people}
                  </td>
                  <td className="p-2 border text-black">{b.date_to_come}</td>
                  <td className="p-2 border text-black">{b.time_to_come}</td>
                  <td className="p-2 border text-black">{b.table_type}</td>
                  <td className="p-2 border text-black">{b.floor}</td>
                  <td className="p-2 border text-black">
                    {b.description || "-"}
                  </td>
                  <td className="p-2 border text-black">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                        b.status === "accepted"
                          ? "bg-green-200 text-green-800"
                          : b.status === "rejected"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {b.status || "pending"}
                    </span>
                  </td>
                  <td className="p-2 border text-black">
                    <div className="flex flex-col md:flex-row justify-center items-center space-x-0 md:space-x-2 space-y-2 md:space-y-0">
                      <button
                        onClick={() => handleEdit(b)}
                        className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(b.booking_id)}
                        className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(b.booking_id, "accepted")
                        }
                        disabled={b.status === "accepted"}
                        className={`px-2 py-1 rounded text-white ${
                          b.status === "accepted"
                            ? "bg-green-700 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-800"
                        }`}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(b.booking_id, "rejected")
                        }
                        disabled={b.status === "rejected"}
                        className={`px-2 py-1 rounded text-white ${
                          b.status === "rejected"
                            ? "bg-yellow-700 cursor-not-allowed"
                            : "bg-yellow-600 hover:bg-yellow-800"
                        }`}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingList;
