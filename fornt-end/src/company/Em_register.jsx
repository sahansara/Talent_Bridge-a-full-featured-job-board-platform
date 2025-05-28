import React, { useState , useEffect} from 'react';
import axios from 'axios';


const images = [
  'src/assets/9.jpg',
  'src/assets/10.jpg',
  'src/assets/11.jpg'
];
const Register = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    rePassword: '',
    comDescription: '',
    contactNumber: '',
    companyWebsite: '',
    companyImage: null,
  });
   

  const [currentImage, setCurrentImage] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  // Slider logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000); // change image every 3 seconds
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
    
    if (!/^\d{10}$/.test(formData.contactNumber)) {
      alert('Contact number must be exactly 10 digits');
      return;
    }
    
    if (formData.password !== formData.rePassword) {
      setPasswordError('Passwords do not match');
      return;
    }  
    setPasswordError(''); // Clear any previous errors
  
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value && key !== 'rePassword') data.append(key, value); // Don't send rePassword
    });
  
    try {
      const response = await axios.post(
        'http://localhost:3000/api/company/employer_register',
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
  
      console.log('Registration successful:', response.data);
      alert('Registered successfully!');
      window.location.href = '/User_login'; // ✅ Navigate after success
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
        alt="Company"
        className="w-full max-w-md object-cover rounded-xl shadow-xl"
      />
      <div className="text-center text-white mt-6 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Join as an Employer</h1>
        <p className="text-base md:text-lg">
          Post jobs, manage candidates, and find the right talent for your company with JobBoard.
        </p>
      </div>
    </div>

      {/* Right Section */}
      <div className="relative flex items-center justify-center p-8 bg-white">
        {/* Login Button */}
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
            Employer Register
          </h2>

          <div>
            <label className="block mb-1 font-semibold">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
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
            <label className="block mb-1 font-semibold">Company Description</label>
            <textarea
              name="comDescription"
              value={formData.comDescription}
              onChange={handleChange}
              rows="3"
              required
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              maxLength="10" // Optional extra layer
              required
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Website (Optional)</label>
            <input
              type="text"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Company Logo / Image</label>
            <input
              type="file"
              name="companyImage"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-2 border rounded-xl"
            />
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

export default Register;
