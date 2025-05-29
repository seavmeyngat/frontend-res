import React, { useEffect, useState } from 'react';
import API from '../APIs/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RestaurantConfigDashboard() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingConfig, setEditingConfig] = useState(null);
  const [form, setForm] = useState({
    restaurant_name: '',
    restaurant_logo_url: '',
    breakfast_from_time: '',
    breakfast_to_time: '',
    lunch_from_time: '',
    lunch_to_time: '',
    location: '',
    contact_phone_1: '',
    contact_email_1: '',
    opening_description: '',
    footer: '',
  });

  // Replace with your backend's base URL (without trailing slash)
  const BASE_URL = 'https://your-backend-domain.com'; 

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/restaurant_config/getAll', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConfigs(res.data);
    } catch (err) {
      console.error('Error fetching configs:', err);
      toast.error('Failed to fetch configs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const resetForm = () => {
    setEditingConfig(null);
    setForm({
      restaurant_name: '',
      restaurant_logo_url: '',
      breakfast_from_time: '',
      breakfast_to_time: '',
      lunch_from_time: '',
      lunch_to_time: '',
      location: '',
      contact_phone_1: '',
      contact_email_1: '',
      opening_description: '',
      footer: '',
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      const token = localStorage.getItem('token');
      const res = await API.post('/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Compose full URL with cache buster to avoid browser caching old image
      const returnedUrl = res.data.url;
      const fullUrl = returnedUrl.startsWith('http') ? returnedUrl : BASE_URL + returnedUrl;
      const urlWithCacheBuster = fullUrl + '?t=' + new Date().getTime();

      setForm((prev) => ({ ...prev, restaurant_logo_url: urlWithCacheBuster }));
      toast.success('Image uploaded successfully!');
    } catch (err) {
      console.error('Image upload error:', err);
      toast.error('Failed to upload image');
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      if (editingConfig) {
        const res = await API.put(`/restaurant_config/${editingConfig.id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConfigs((prev) => prev.map((c) => (c.id === res.data.id ? res.data : c)));
        toast.success('Configuration updated');
      } else {
        const res = await API.post('/restaurant_config/new', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConfigs((prev) => [...prev, res.data]);
        toast.success('Configuration created');
      }

      resetForm();
    } catch (err) {
      console.error('Error saving config:', err);
      toast.error('Failed to save configuration');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this configuration?')) return;
    const token = localStorage.getItem('token');
    try {
      await API.delete(`/restaurant_config/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConfigs((prev) => prev.filter((c) => c.id !== id));
      toast.success('Configuration deleted');
    } catch (err) {
      console.error('Error deleting config:', err);
      toast.error('Failed to delete configuration');
    }
  };

  const handleEdit = (config) => {
    setEditingConfig(config);

    // To ensure the image URL includes cache buster on editing (optional)
    const logoUrl = config.restaurant_logo_url || '';
    const fullLogoUrl = logoUrl.startsWith('http') ? logoUrl : BASE_URL + logoUrl;

    setForm({ ...config, restaurant_logo_url: fullLogoUrl });
  };

  return (
    <div className="main-container bg-white p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-black">Restaurant Configuration</h1>

      {/* Form */}
      <form
  onSubmit={handleCreateOrUpdate}
  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-white shadow-sm p-6 rounded-lg border"
>
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">Restaurant Name</label>
    <input
      type="text"
      required
      value={form.restaurant_name}
      onChange={(e) => setForm({ ...form, restaurant_name: e.target.value })}
      className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
      placeholder="Restaurant Name"
    />
  </div>

  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">Location</label>
    <input
      type="text"
      value={form.location}
      onChange={(e) => setForm({ ...form, location: e.target.value })}
      className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
      placeholder="Location"
    />
  </div>

  {/* Image Upload */}
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Logo</label>
    <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="w-full p-2 border rounded text-black"
    />
    {form.restaurant_logo_url && (
      <img
        src={form.restaurant_logo_url}
        alt="Uploaded Logo"
        className="h-16 mt-2 object-contain border rounded"
      />
    )}
  </div>

  {/* Time Inputs */}
  <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Breakfast From</label>
      <input
        type="time"
        value={form.breakfast_from_time}
        onChange={(e) => setForm({ ...form, breakfast_from_time: e.target.value })}
        className="p-2 border rounded text-black"
      />
    </div>
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Breakfast To</label>
      <input
        type="time"
        value={form.breakfast_to_time}
        onChange={(e) => setForm({ ...form, breakfast_to_time: e.target.value })}
        className="p-2 border rounded text-black"
      />
    </div>
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Lunch From</label>
      <input
        type="time"
        value={form.lunch_from_time}
        onChange={(e) => setForm({ ...form, lunch_from_time: e.target.value })}
        className="p-2 border rounded text-black"
      />
    </div>
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Lunch To</label>
      <input
        type="time"
        value={form.lunch_to_time}
        onChange={(e) => setForm({ ...form, lunch_to_time: e.target.value })}
        className="p-2 border rounded text-black"
      />
    </div>
  </div>

  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">Phone</label>
    <input
      type="text"
      value={form.contact_phone_1}
      onChange={(e) => setForm({ ...form, contact_phone_1: e.target.value })}
      className="p-2 border rounded text-black"
      placeholder="Phone"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
    <input
      type="email"
      value={form.contact_email_1}
      onChange={(e) => setForm({ ...form, contact_email_1: e.target.value })}
      className="p-2 border rounded text-black"
      placeholder="Email"
    />
  </div>

  <div className="md:col-span-2">
    <label className="text-sm font-medium text-gray-700 mb-1">Opening Description</label>
    <textarea
      value={form.opening_description}
      onChange={(e) => setForm({ ...form, opening_description: e.target.value })}
      className="w-full p-2 border rounded text-black"
      rows={3}
      placeholder="Describe the opening..."
    />
  </div>

  <div className="md:col-span-2">
    <label className="text-sm font-medium text-gray-700 mb-1">Footer Text</label>
    <textarea
      value={form.footer}
      onChange={(e) => setForm({ ...form, footer: e.target.value })}
      className="w-full p-2 border rounded text-black"
      rows={2}
      placeholder="Footer text..."
    />
  </div>

  {/* Action Buttons */}
  <div className="flex gap-4 md:col-span-2">
    <button
      type="submit"
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
    >
      {editingConfig ? "Update Config" : "Create Config"}
    </button>
    {editingConfig && (
      <button
        type="button"
        onClick={resetForm}
        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded transition"
      >
        Cancel
      </button>
    )}
  </div>
</form>


      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full border text-left text-sm">
            <thead className="bg-gray-600 text-white">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Logo</th>
                <th className="p-2 border">Breakfast From</th>
                <th className="p-2 border">Breakfast To</th>
                <th className="p-2 border">Lunch From</th>
                <th className="p-2 border">Lunch To</th>
                <th className="p-2 border">Location</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Opening Description</th>
                <th className="p-2 border">Footer</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {configs.length === 0 ? (
                <tr>
                  <td colSpan="12" className="p-4 text-center text-black">
                    No configurations found.
                  </td>
                </tr>
              ) : (
                configs.map((config) => {
                  // Ensure full URL for image in table as well
                  const logoUrl = config.restaurant_logo_url || '';
                  const fullLogoUrl = logoUrl.startsWith('http') ? logoUrl : BASE_URL + logoUrl;

                  return (
                    <tr key={config.id}>
                      <td className="p-2 border text-black">{config.restaurant_name}</td>
                      <td className="p-2 border text-black">
                        {logoUrl ? (
                          <img src={fullLogoUrl} alt="logo" className="h-10 object-contain" />
                        ) : (
                          'No Logo'
                        )}
                      </td>
                      <td className="p-2 border text-black">{config.breakfast_from_time}</td>
                      <td className="p-2 border text-black">{config.breakfast_to_time}</td>
                      <td className="p-2 border text-black">{config.lunch_from_time}</td>
                      <td className="p-2 border text-black">{config.lunch_to_time}</td>
                      <td className="p-2 border text-black">{config.location}</td>
                      <td className="p-2 border text-black">{config.contact_phone_1}</td>
                      <td className="p-2 border text-black">{config.contact_email_1}</td>
                      <td className="p-2 border text-black">{config.opening_description}</td>
                      <td className="p-2 border text-black">{config.footer}</td>
                      <td className="p-2 border text-black">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(config)}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(config.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RestaurantConfigDashboard;
