import React from 'react';

const PasswordField = ({ 
  id, 
  name, 
  label, 
  placeholder, 
  value, 
  onChange, 
  showPassword, 
  toggleShowPassword 
}) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-medium mb-2">
      {label}
    </label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={placeholder}
      />
      <button 
        type="button"
        onClick={toggleShowPassword}
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <i className={`bx ${showPassword ? 'bx-hide' : 'bx-show'} text-gray-500`}></i>
      </button>
    </div>
  </div>
);

const securityTab = ({ 
  formData, 
  handleInputChange,
  showCurrentPassword,
  showNewPassword,
  showConfirmPassword,
  setShowCurrentPassword,
  setShowNewPassword,
  setShowConfirmPassword
}) => {
  return (
    <div className="space-y-6">
      <PasswordField
        id="currentPassword"
        name="currentPassword"
        label="Current Password"
        placeholder="Enter current password"
        value={formData.currentPassword}
        onChange={handleInputChange}
        showPassword={showCurrentPassword}
        toggleShowPassword={() => setShowCurrentPassword(!showCurrentPassword)}
      />
      
      <PasswordField
        id="newPassword"
        name="newPassword"
        label="New Password"
        placeholder="Enter new password"
        value={formData.newPassword}
        onChange={handleInputChange}
        showPassword={showNewPassword}
        toggleShowPassword={() => setShowNewPassword(!showNewPassword)}
      />
      
      <PasswordField
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm New Password"
        placeholder="Confirm new password"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        showPassword={showConfirmPassword}
        toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
      />
    </div>
  );
};

export default securityTab;