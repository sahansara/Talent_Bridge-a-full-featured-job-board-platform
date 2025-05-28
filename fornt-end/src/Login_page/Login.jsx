import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';


const images = [
  'src/assets/9.jpg',
  'src/assets/10.jpg',
  'src/assets/11.jpg'
];

const Login = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  // Add this useEffect right after your useState declarations to load saved email on component mount
useEffect(() => {
  const savedEmail = localStorage.getItem('savedEmail');
  if (savedEmail) {
    setFormData(prev => ({
      ...prev,
      email: savedEmail,
      remember: true
    }));
  }
}, []);

// Update the handleSubmit function to save or remove the email based on remember checkbox
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post('http://localhost:3000/login', {
      email: formData.email,
      password: formData.password,
      remember: formData.remember
    });

    console.log(res.data);
      
    // Store the token if it exists in the response
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      
      // If remember me is checked, save the email
      if (formData.remember) {
        localStorage.setItem('savedEmail', formData.email);
      } else {
        // If not checked, remove any saved email
        localStorage.removeItem('savedEmail');
      }
    }
    
    // Check user role and redirect accordingly
    const userRole = res.data.role;
    
    switch(userRole) {
      case 'jobseeker':
        navigate('/job-seeker/dashboard');
        break;
      case 'Company':
        navigate('/Employer_dashboard');
        break;
      case 'Admin':
        navigate('/admin/dashboard');
        break;
      default:
        // Fallback if role is not recognized
        alert('Unknown user role. Please contact support.');
    }

    alert('Login successful!');
  } catch (err) {
    console.error('Login failed:', err.response?.data || err.message);
    alert('Login failed. Please check your credentials.');
  }
};

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-100">
      
      {/* Left Image Section */}
      <div className="bg-blue-600 flex flex-col items-center justify-center p-6">
        <img
          src={images[currentImage]}
          alt="Slider"
          className="w-full max-w-md object-cover rounded-xl shadow-xl"
        />
        <div className="text-center text-white mt-6 px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to JobBoard</h1>
          <p className="text-base md:text-lg">Log in to find jobs, hire talent, or manage the platform.</p>
        </div>
        <a
          href="/"
          className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-lg shadow hover:bg-gray-100 transition-all duration-300 font-semibold"
        >
          Sign Up
        </a>
      </div>

      {/* Right Login Form */}
      <div className="relative flex items-center justify-center p-8 bg-white">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-5"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>

          <div className="relative">
            <label className="block mb-1 font-semibold">Email</label>
            <div className="flex items-center border rounded-xl p-3">
              <i className='bx bxs-user text-xl text-gray-400 mr-3'></i>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block mb-1 font-semibold">Password</label>
            <div className="flex items-center border rounded-xl p-3">
            <i
              className={`bx ${passwordVisible ? 'bxs-lock-open' : 'bxs-lock'} text-gray-500 text-xl absolute right-3 cursor-pointer`}
              onClick={togglePasswordVisibility}
            ></i>
               <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full p-3 focus:outline-none"
            />
            
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              Remember Me
            </label>
            <a href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold"
          >
            Login <i className='bx bxs-lock-open ml-2'></i>
          </button>

          <p className="text-sm text-center mt-4">
            Don’t have an account? <a href="/register" className="text-blue-600 hover:underline">Sign up here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
