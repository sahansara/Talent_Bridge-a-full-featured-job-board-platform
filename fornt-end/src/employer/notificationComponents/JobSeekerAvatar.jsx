import React from 'react';
import { UserPlus } from 'lucide-react';

const JobSeekerAvatar = ({ jobSeekerImage, jobSeekerName }) => {
  return (
    <div className="mr-4 flex-shrink-0">
      <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm">
        {jobSeekerImage ? (
          <img 
            src={jobSeekerImage.startsWith('http') ? jobSeekerImage : `http://localhost:3000/${jobSeekerImage}`} 
            alt={`${jobSeekerName || 'Job Seeker'} profile`}
            className="h-full w-full object-cover"
          />
        ) : (
          <UserPlus className="text-blue-400" size={20} />
        )}
      </div>
    </div>
  );
};

export default JobSeekerAvatar;