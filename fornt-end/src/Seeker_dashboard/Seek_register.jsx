import React, { useState, useEffect } from 'react';
import axios from 'axios';

const images = [
  'src/assets/9.jpg',
  'src/assets/10.jpg',
  'src/assets/11.jpg'
];

const Seek_register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    rePassword: '',
    cv_Upload: null,
    image: null,
  });
  
  const [passwordError, setPasswordError] = useState('');

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.rePassword) {
      setPasswordError('Passwords do not match');
      return;
    } else {
      setPasswordError('');
    }
  
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
  
    try {
      const response = await axios.post('http://localhost:3000', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
  
     
      alert('Registered successfully!');
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      alert('Registration failed. Check console for details.');
    }
  };
  

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-100">
      {/* Left Section (Image Slider) */}
      <div className="bg-blue-600 flex flex-col items-center justify-center p-6 transition-all duration-700">
        <img
          src={images[currentImage]}
          alt="Job Seeker"
          className="w-full max-w-md object-cover rounded-xl shadow-xl"
        />
        <div className="text-center text-white mt-6 px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Join as a Job Seeker</h1>
          <p className="text-base md:text-lg">
            Create your profile, upload your CV, and connect with top employers on JobBoard.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="relative flex items-center justify-center p-8 bg-white">
        <a
          href="/User_login"
          className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all duration-300"
        >
          Login
        </a>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl space-y-5"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Job Seeker Register
          </h2>

          <div>
            <label className="block mb-1 font-semibold">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Re-enter Password</label>
            <input
              type="password"
              name="rePassword"
              value={formData.rePassword}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring focus:ring-blue-300"
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>


          <div>
            <label className="block mb-1 font-semibold">Upload CV (PDF)</label>
            <input
              type="file"
              name="cv_Upload"
              accept=".pdf"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-xl"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Profile Photo</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-2 border rounded-xl"
            />
          </div> 

          <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="isJobSeeker"
                id="isJobSeeker"
                checked={true}
                readOnly
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isJobSeeker" className="ml-2 font-semibold text-gray-700">
                I am a job seeker
              </label>
            </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Seek_register;
