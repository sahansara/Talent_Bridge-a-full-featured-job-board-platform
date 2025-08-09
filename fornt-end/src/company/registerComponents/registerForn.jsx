import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Building2, Mail, Lock, Upload, Camera, Globe, Phone, FileText, ArrowRight, CheckCircle } from 'lucide-react';
import axios from 'axios';


const Register = ({ currentTheme = { primary: 'from-blue-500 to-blue-700' } }) => {
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

  
  const [passwordError, setPasswordError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState({ password: false, rePassword: false });

 

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
    
    if (!/^\d{10}$/.test(formData.contactNumber)) {
      alert('Contact number must be exactly 10 digits');
      return;
    }
    
    if (formData.password !== formData.rePassword) {
      setPasswordError('Passwords do not match');
      return;
    }  
    setPasswordError('');
  
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value && key !== 'rePassword') data.append(key, value);
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
      window.location.href = '/User_login';
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      alert('Registration failed. Check console for details.');
    }
  };

  const basicFields = [
    { name: 'companyName', type: 'text', label: 'Company Name', icon: <Building2 className="w-5 h-5" />, placeholder: 'Enter your company name', required: true },
    { name: 'email', type: 'email', label: 'Email Address', icon: <Mail className="w-5 h-5" />, placeholder: 'Enter company email', required: true },
    { name: 'contactNumber', type: 'text', label: 'Contact Number', icon: <Phone className="w-5 h-5" />, placeholder: 'Enter 10-digit number', required: true, maxLength: "10" },
    { name: 'companyWebsite', type: 'text', label: 'Company Website', icon: <Globe className="w-5 h-5" />, placeholder: 'https://yourcompany.com', required: false }
  ];

  const passwordFields = [
    { name: 'password', label: 'Password', placeholder: 'Create a password' },
    { name: 'rePassword', label: 'Confirm Password', placeholder: 'Re-enter password' }
  ];

  return (
    
     <div className="w-full max-w-md">

     

      
          {/* Form Container */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              Employer Register
            </h2>
            <p className="text-gray-400 text-sm">Join our platform as an employer</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Basic Info Fields */}
            {basicFields.map(field => (
              <div key={field.name} className="relative">
                <label className="block text-white font-medium mb-2 text-sm">{field.label}</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {field.icon}
                  </div>
                  <input 
                    type={field.type} 
                    name={field.name} 
                    value={formData[field.name]} 
                    onChange={handleChange} 
                    required={field.required}
                    maxLength={field.maxLength}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:bg-white/20 focus:border-white/40 focus:outline-none transition-all duration-300 text-sm"
                    placeholder={field.placeholder} 
                  />
                </div>
              </div>
            ))}

            {/* Company Description */}
            <div className="relative">
              <label className="block text-white font-medium mb-2 text-sm">Company Description</label>
              <div className="relative">
                <div className="absolute left-4 top-4 text-gray-400">
                  <FileText className="w-5 h-5" />
                </div>
                <textarea
                  name="comDescription"
                  value={formData.comDescription}
                  onChange={handleChange}
                  rows="3"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:bg-white/20 focus:border-white/40 focus:outline-none transition-all duration-300 text-sm resize-none"
                  placeholder="Tell us about your company..."
                />
              </div>
            </div>

            {/* Password Fields */}
            {passwordFields.map(field => (
              <div key={field.name} className="relative">
                <label className="block text-white font-medium mb-2 text-sm">{field.label}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type={passwordVisible[field.name] ? 'text' : 'password'} 
                    name={field.name} 
                    value={formData[field.name]} 
                    onChange={handleChange} 
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-12 py-3 text-white placeholder-gray-400 focus:bg-white/20 focus:border-white/40 focus:outline-none transition-all duration-300 text-sm"
                    placeholder={field.placeholder} 
                  />
                  <button 
                    type="button" 
                    onClick={() => togglePassword(field.name)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {passwordVisible[field.name] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {field.name === 'rePassword' && passwordError && (
                  <p className="text-red-400 text-xs mt-1">{passwordError}</p>
                )}
              </div>
            ))}

            {/* Company Logo Upload */}
            <div className="relative">
              <label className="block text-white font-medium mb-2 text-sm">Company Logo / Image</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Camera className="w-5 h-5" />
                </div>
                <input 
                  type="file" 
                  name="companyImage" 
                  accept="image/*" 
                  onChange={handleChange} 
                  className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-4 py-3 text-white file:bg-transparent file:border-0 file:text-gray-400 file:text-sm hover:bg-white/20 focus:bg-white/20 focus:border-white/40 focus:outline-none transition-all duration-300 text-sm" 
                />
              </div>
            </div>

            {/* Employer Checkbox */}
            <div className="flex items-center space-x-3 p-3 rounded-2xl">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <label className="text-white font-medium text-sm cursor-pointer">
                I am registering as an employer
              </label>
            </div>

            {/* Register Button */}
            <button 
              type="submit"
              className={`w-full bg-gradient-to-r ${currentTheme?.primary || 'from-blue-500 to-blue-700'} hover:scale-105 rounded-2xl py-3 font-semibold text-white transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 group text-sm`}
            >
              <span className="flex items-center justify-center">
                Register Company
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-400 text-sm">
              Already have an account?{' '}
              <a 
                href="/User_login"
                className="text-blue-400 hover:text-white font-medium transition-colors duration-300"
              >
                Sign in here
              </a>
            </p>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <a 
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors duration-300 text-sm"
          >
            ← Back to homepage
          </a>
        </div>
      </div>


  )}

export default Register;