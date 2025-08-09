// src/components/ErrorMessage.js
import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="text-center p-6 bg-red-50 rounded-lg text-red-600">
      <AlertCircle className="mx-auto mb-2" size={32} />
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;