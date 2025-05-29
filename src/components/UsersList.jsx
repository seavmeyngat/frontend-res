import React, { useEffect, useState } from 'react';
import axios from '../APIs/axios';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, user is not authenticated');
        setUsers([]);
        setLoading(false);
        return;
      }

      const res = await axios.get('/users/getAll', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, user is not authenticated');
        return;
      }

      await axios.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.username} ${user.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-container bg-white p-4 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-black">Users</h1>

      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded text-black w-full max-w-md"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-center">No users found.</p>
      ) : (
        <table className="w-full border text-left">
          <thead className="bg-gray-600 text-white">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="p-2 border text-black">{user.username}</td>
                <td className="p-2 border text-black">{user.email}</td>
                <td className="p-2 border text-black">{user.role}</td>
                <td className="p-2 border text-black">
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Users;
