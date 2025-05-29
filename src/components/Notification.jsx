import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NotificationDashboard() {
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({
    notify_type: '',
    notify_date: '',
    description: '',
  });
  const [editingId, setEditingId] = useState(null);

  const API_URL = 'http://localhost:5000/api/notifications';

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_URL}`);
      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const resetForm = () => {
    setForm({ notify_type: '', notify_date: '', description: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.notify_type || !form.notify_date || !form.description) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      if (editingId) {
        // UPDATE
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });

        if (!res.ok) throw new Error('Failed to update notification');

        toast.success('Notification updated');
      } else {
        // CREATE
        const res = await fetch(`${API_URL}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });

        if (!res.ok) throw new Error('Failed to create notification');

        toast.success('Notification created');
      }

      resetForm();
      fetchNotifications();
    } catch (error) {
      console.error(error);
      toast.error('Operation failed');
    }
  };

  const handleEdit = (notification) => {
    setForm({ ...notification });
    setEditingId(notification.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete notification');

      toast.success('Notification deleted');
      fetchNotifications();
      if (editingId === id) resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Delete failed');
    }
  };

  return (
    <div className="main-container bg-white p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-black">Restaurant Notification</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-100 p-4 rounded"
      >
        <div className="flex flex-col">
          <label htmlFor="notify_type" className="mb-1 text-gray-700 font-medium">
            Notification Type
          </label>
          <select
            id="notify_type"
            value={form.notify_type}
            onChange={(e) => setForm({ ...form, notify_type: e.target.value })}
            className="p-2 border rounded text-black"
            required
          >
            <option value="">Select Type</option>
            <option value="closed">Closed</option>
            <option value="info">Info</option>
            <option value="full">Full</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="notify_date" className="mb-1 text-gray-700 font-medium">
            Notification Date
          </label>
          <input
            id="notify_date"
            type="date"
            value={form.notify_date}
            onChange={(e) => setForm({ ...form, notify_date: e.target.value })}
            className="p-2 border rounded text-black"
            required
          />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label htmlFor="description" className="mb-1 text-gray-700 font-medium">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="p-2 border rounded text-black"
            required
          />
        </div>

        <div className="flex gap-4 md:col-span-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {editingId ? 'Update Notification' : 'Create Notification'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full border text-left text-sm">
          <thead className="bg-gray-600 text-white">
            <tr>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-black">
                  No notifications found.
                </td>
              </tr>
            ) : (
              notifications.map((notification) => (
                <tr key={notification.id}>
                  <td className="p-2 border text-black capitalize">{notification.notify_type}</td>
                  <td className="p-2 border text-black">{notification.notify_date}</td>
                  <td className="p-2 border text-black">{notification.description}</td>
                  <td className="p-2 border text-black">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(notification)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default NotificationDashboard;
