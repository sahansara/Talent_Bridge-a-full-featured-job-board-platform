import React from 'react';
import { FORM_FIELDS } from '../../utils/employer/Profile';

const PersonalInfoTab = ({ formData, handleInputChange }) => {
  const fields = FORM_FIELDS.employer;

  const renderField = (fieldName, fieldConfig) => {
    const { label, type, placeholder, helper, rows } = fieldConfig;
    
    if (type === 'textarea') {
      return (
        <div key={fieldName} className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            {label}
          </label>
          <textarea
            name={fieldName}
            value={formData[fieldName]}
            rows={rows || 4}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={placeholder}
          />
          {helper && (
            <p className="text-xs text-gray-500 mt-1">{helper}</p>
          )}
        </div>
      );
    }

    return (
      <div key={fieldName} className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          {label}
        </label>
        <input
          type={type}
          name={fieldName}
          value={formData[fieldName]}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder}
        />
        {helper && (
          <p className="text-xs text-gray-500 mt-1">{helper}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {Object.entries(fields).map(([fieldName, fieldConfig]) => 
        renderField(fieldName, fieldConfig)
      )}
    </div>
  );
};

export default PersonalInfoTab;