import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Upload, Camera, Briefcase, ArrowRight, FileText, Shield, CheckCircle } from 'lucide-react'; 
import { colorThemes } from '../../colorThemes/colorThemes';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterForm = ({ currentTheme = { primary: 'from-blue-500 to-blue-700' },onSubmit,isSubmitting }) => {
  const [passwordVisible, setPasswordVisible] = useState({ password: false, rePassword: false });
  const [passwordError, setPasswordError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    rePassword: '',
    cv_Upload: null,
    image: null,
  });

  const togglePassword = (field) => {
    setPasswordVisible(prev => ({ ...prev, [field]: !prev[field] }));
  };

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
  
  // Validation
  if (formData.password !== formData.rePassword) {
    setPasswordError('Passwords do not match');
    return;
  } else {
    setPasswordError('');
  }


  if (!formData.fullName || !formData.email || !formData.password || !formData.cv_Upload) {
    alert('Please fill in all required fields');
    return;
  }

  // Create FormData
  const data = new FormData();
  data.append('fullName', formData.fullName);
  data.append('email', formData.email);
  data.append('password', formData.password);
  if (formData.cv_Upload) data.append('cv_Upload', formData.cv_Upload);
  if (formData.image) data.append('image', formData.image);

  try {
    // Call parent's onSubmit function
    if (onSubmit) {
      await onSubmit(data);
    }
  } catch (error) {
    console.error('Registration failed:', error);
    // Error is already handled in parent component
  }
};
  const handleNavigation = useNavigate();

  const inputFields = [
    { name: 'fullName', type: 'text', label: 'Full Name', icon: <User className="w-5 h-5" />, placeholder: 'Enter your full name' },
    { name: 'email', type: 'email', label: 'Email Address', icon: <Mail className="w-5 h-5" />, placeholder: 'Enter your email' }
  ];

  const passwordFields = [
    { name: 'password', label: 'Password', placeholder: 'Create a password' },
    { name: 'rePassword', label: 'Confirm Password', placeholder: 'Re-enter password' }
  ];

  const fileFields = [
    { name: 'cv_Upload', label: 'Upload CV (PDF)', accept: '.pdf', icon: <FileText className="w-5 h-5" />, required: true },
    { name: 'image', label: 'Profile Photo', accept: 'image/*', icon: <Camera className="w-5 h-5" />, required: false }
  ];
  const navigate = useNavigate
  return (
        <div className="w-full max-w-md">

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative w-full max-w-md mx-auto">
        {/* Form Container */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              Create Account
            </h2>
            <p className="text-gray-400 text-sm">Join thousands of job seekers</p>
          </div>

          {/* Scrollable Form Content */}
          <div className="max-h-96 overflow-y-auto scrollbar-hide pr-2">
            <div className="space-y-4">
              {/* Basic Info Fields */}
              {inputFields.map(field => (
                <div key={field.name} className="relative">
                  <label className="block text-white font-medium mb-1 text-sm">{field.label}</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      {field.icon}
                    </div>
                    <input 
                      type={field.type} 
                      name={field.name} 
                      value={formData[field.name]} 
                      onChange={handleChange} 
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:bg-white/20 focus:border-white/40 focus:outline-none transition-all duration-300 text-sm"
                      placeholder={field.placeholder} 
                    />
                  </div>
                </div>
              ))}

              {/* Password Fields */}
              {passwordFields.map(field => (
                <div key={field.name} className="relative">
                  <label className="block text-white font-medium mb-1 text-sm">{field.label}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type={passwordVisible[field.name] ? 'text' : 'password'} 
                      name={field.name} 
                      value={formData[field.name]} 
                      onChange={handleChange} 
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-12 py-2.5 text-white placeholder-gray-400 focus:bg-white/20 focus:border-white/40 focus:outline-none transition-all duration-300 text-sm"
                      placeholder={field.placeholder} 
                    />
                    <button 
                      type="button" 
                      onClick={() => togglePassword(field.name)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {passwordVisible[field.name] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {field.name === 'rePassword' && passwordError && (
                    <p className="text-red-400 text-xs mt-1">{passwordError}</p>
                  )}
                </div>
              ))}

              {/* File Upload Fields */}
              {fileFields.map(field => (
                <div key={field.name} className="relative">
                  <label className="block text-white font-medium mb-1 text-sm">{field.label}</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      {field.icon}
                    </div>
                    <input 
                      type="file" 
                      name={field.name} 
                      accept={field.accept} 
                      onChange={handleChange} 
                      required={field.required}
                      className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-white file:bg-transparent file:border-0 file:text-gray-400 file:text-sm hover:bg-white/20 focus:bg-white/20 focus:border-white/40 focus:outline-none transition-all duration-300 text-sm" 
                    />
                  </div>
                </div>
              ))}

              {/* Job Seeker Checkbox */}
              <div className="flex items-center space-x-3 p-2 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <label className="text-white font-medium text-sm">
                  I am a job seeker
                </label>
              </div>
            </div>
          </div>

          {/* Fixed Bottom Section */}
          <div className="mt-4 space-y-3">
            {/* Register Button */}
            <button 
        onClick={handleSubmit}
        disabled={isSubmitting} // Disable when submitting
        className={`w-full bg-gradient-to-r ${currentTheme?.primary || 'from-blue-500 to-blue-700'} 
                   ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} 
                   rounded-xl py-3 font-semibold text-white transition-all duration-300 
                   hover:shadow-2xl hover:shadow-blue-500/25 group text-sm`}
      >
        <span className="flex items-center justify-center">
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
          {!isSubmitting && (
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          )}
        </span>
      </button>

            {/* Login Link */}
            <p className="text-center text-gray-400 text-sm">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => handleNavigation('/User_login')}
                className="text-blue-400 hover:text-white font-medium transition-colors duration-300"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <button 
            onClick={() => handleNavigation('/')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors duration-300 text-sm"
          >
            ← Back to homepage
          </button>
        </div>
      </div>

      {/* Custom CSS for hiding scrollbar */}
     <style>{`
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`}</style>
    </div>
  );
};

export default RegisterForm;