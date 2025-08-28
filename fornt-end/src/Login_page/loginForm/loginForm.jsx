import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export const LoginForm = ({ currentTheme = { primary: 'from-blue-500 to-blue-700' } }) => {
  const [theme, setTheme] = useState('blue');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', remember: false });
  const navigate = useNavigate();
  
  

  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage?.getItem('savedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail, remember: true }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axios.post('http://localhost:3000/api/login', {
        email: formData.email,
        password: formData.password,
        remember: formData.remember
      });

      
        
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
          navigate('/jobSeeker/dashboard');
          break;
        case 'employer':
          navigate('/employer/dashboard');
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
    <div className="w-full max-w-md">
      

      {/* Form Container */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2 py-1">
            Sign In
          </h2>
          <p className="text-gray-400">Enter your credentials to continue</p>
        </div>

        {/* Form Wrapper */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <label className="block text-white font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:bg-white/20 focus:border-white/40 focus:outline-none transition-all duration-300"
                  placeholder="Enter your email" 
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-white font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type={passwordVisible ? 'text' : 'password'} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:bg-white/20 focus:border-white/40 focus:outline-none transition-all duration-300"
                  placeholder="Enter your password" 
                />
                <button 
                  type="button" 
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-300 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="remember" 
                  checked={formData.remember} 
                  onChange={handleChange}
                  className="mr-2 rounded bg-white/10 border-white/20 text-purple-500 focus:ring-purple-500" 
                />
                Remember me
              </label>
              <button 
                type="button"
                className="text-blue-400 hover:text-white transition-colors duration-300"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button 
              type="submit"
              className={`w-full bg-gradient-to-r ${currentTheme?.primary || 'from-blue-500 to-blue-700'} hover:scale-105 rounded-2xl py-4 font-semibold text-white transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 group`}
            >
              <span className="flex items-center justify-center">
                Sign In
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-gray-400">
              Don't have an account?{' '}
              <button 
                type="button"
                className="text-blue-400 hover:text-white font-medium transition-colors duration-300"
                onClick={() => navigate('/Seeker_register')}
              >
                Create one here
              </button>
            </p>
          </div>
        </form>
      </div>

      {/* Back to Home */}
      <div className="text-center mt-6">
        <button
          onClick={() => navigate('/')} 
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors duration-300"
        >
          ← Back to homepage
        </button>
      </div>
    </div>
  );
};