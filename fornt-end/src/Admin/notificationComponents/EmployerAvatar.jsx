import React from 'react';
import { Briefcase } from 'lucide-react';
import { API_BASE_URLS } from '../../config/api';

const EmployerAvatar = ({ employerImage, employerName }) => {
  return (
    <div className="mr-4 flex-shrink-0">
      <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm">
        {employerImage ? (
          <img 
            src={employerImage.startsWith('http') ? employerImage : `${API_BASE_URLS}/${employerImage}`} 
            alt={`${employerName || 'Job Seeker'} profile`}
            className="h-full w-full object-cover"
          />
        ) : (
          <Briefcase className="text-gray-400" size={20} />
        )}
      </div>
    </div>
  );
};

export default EmployerAvatar;