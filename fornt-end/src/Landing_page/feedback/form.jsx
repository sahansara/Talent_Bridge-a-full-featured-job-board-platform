import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const FeedbackForm = ({ theme, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'jobSeeker',
    rating: 5,
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.message.trim().length < 10) {
      alert("Feedback must be at least 10 characters long.");
      return;
    }

    try {
      
      await onSubmit(formData);
      
      
      alert('Thank you for your feedback! It will appear shortly.');
      
    
      setFormData({
        name: '',
        email: '',
        role: 'jobSeeker',
        rating: 5,
        message: ''
      });
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to submit feedback. Please try again later.');
    }
  };

  return (
    <div className="flex justify-center">
      <div className="bg-white/5 rounded-xl p-6 border border-white/10 w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label className="block text-white font-medium mb-2 text-sm">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-white font-medium mb-2 text-sm">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50"
              placeholder="Enter your email"
            />
          </div>

          {/* User Type Radio */}
          <div>
            <label className="block text-white font-medium mb-2 text-sm">I am a</label>
            <div className="flex space-x-6">
              <label className="flex items-center cursor-pointer text-sm">
                <input
                  type="radio"
                  name="role"
                  value="jobSeeker"
                  checked={formData.role === 'jobSeeker'}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                />
                <span className="ml-2 text-white">Job Seeker</span>
              </label>
              <label className="flex items-center cursor-pointer text-sm">
                <input
                  type="radio"
                  name="role"
                  value="employer"
                  checked={formData.role === 'employer'}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                />
                <span className="ml-2 text-white">Employer</span>
              </label>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-white font-medium mb-2 text-sm">Rating</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            >
              <option value={5} className="bg-gray-800">⭐⭐⭐⭐⭐ Excellent</option>
              <option value={4} className="bg-gray-800">⭐⭐⭐⭐ Very Good</option>
              <option value={3} className="bg-gray-800">⭐⭐⭐ Good</option>
              <option value={2} className="bg-gray-800">⭐⭐ Fair</option>
              <option value={1} className="bg-gray-800">⭐ Poor</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-white font-medium mb-2 text-sm">Your Feedback</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none disabled:opacity-50"
              placeholder="Tell us about your experience..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r ${theme.primary} hover:scale-105 rounded-lg px-4 py-2 font-medium transition-all duration-300 text-sm flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            <FaPaperPlane className={`${isSubmitting ? 'animate-pulse' : 'group-hover:translate-x-1'} transition-transform duration-300`} />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;