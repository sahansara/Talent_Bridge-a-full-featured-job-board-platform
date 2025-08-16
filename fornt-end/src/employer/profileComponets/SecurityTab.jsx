import React from 'react';
import { FORM_FIELDS } from '../../utils/employer/Profile';

const SecurityTab = ({ 
  formData, 
  handleInputChange, 
  passwordVisibility, 
  togglePasswordVisibility 
}) => {
  const fields = FORM_FIELDS.security;

  const renderPasswordField = (fieldName, fieldConfig) => {
    const { label, placeholder } = fieldConfig;
    const isVisible = passwordVisibility[`show${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`];
    const toggleKey = `show${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`;

    return (
      <div key={fieldName} className="mb-4 relative">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          {label}
        </label>
        <div className="relative">
          <input
            type={isVisible ? "text" : "password"}
            id={fieldName}
            name={fieldName}
            value={formData[fieldName]}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={placeholder}
          />
          <button 
            type="button"
            onClick={() => togglePasswordVisibility(toggleKey)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <i className={`bx ${isVisible ? 'bx-hide' : 'bx-show'} text-gray-500`}></i>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {Object.entries(fields).map(([fieldName, fieldConfig]) => 
        renderPasswordField(fieldName, fieldConfig)
      )}
    </div>
  );
};

export default SecurityTab;