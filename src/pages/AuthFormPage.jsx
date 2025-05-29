import React, { useState } from 'react';
import axios from '../APIs/axios';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // If redirected from a protected page, we preserve the intended path
  const from = location.state?.from?.pathname || '/dashboard';

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user',
    });
    setMessage('');
    setError('');
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      let res;
      if (isRegister) {
        res = await axios.post('/users/register', formData);
        setMessage(res.data.message || 'User registered successfully');
      } else {
        res = await axios.post('/users/login', {
          email: formData.email,
          password: formData.password,
        });
        setMessage(res.data.message || 'Logged in successfully');
      }

      const { token, user } = res.data;

      if (token) {
        localStorage.setItem('token', token);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      resetForm();

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isRegister ? 'Register' : 'Login'}
        </h2>

        {message && <p className="text-green-600 mb-4 text-center">{message}</p>}
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <label className="block mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full mb-3 border px-3 py-2 rounded"
              />
            </>
          )}

          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full mb-3 border px-3 py-2 rounded"
          />

          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full mb-3 border px-3 py-2 rounded"
          />

          {isRegister && (
            <>
              <label className="block mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full mb-6 border px-3 py-2 rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4"
          >
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <p className="text-center">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              resetForm();
            }}
            className="text-blue-600 underline hover:text-blue-800 focus:outline-none"
          >
            {isRegister ? 'Login here' : 'Register here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
