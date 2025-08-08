import React, { useRef } from 'react';

const documentsTab = ({ currentCV, onCVUpload }) => {
  const cvInputRef = useRef(null);

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Resume/CV
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button 
            type="button"
            onClick={() => cvInputRef.current.click()}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center"
          >
            <i className="bx bx-upload mr-2"></i> Upload PDF
          </button>
          
          <span className="text-gray-600 break-all text-sm">
            {currentCV ? (
              <span className="flex items-center">
                <i className="bx bxs-file-pdf text-red-500 mr-2"></i>
                {currentCV}
              </span>
            ) : (
              'No CV uploaded'
            )}
          </span>
          
          <input 
            type="file" 
            ref={cvInputRef}
            onChange={onCVUpload}
            className="hidden" 
            accept=".pdf"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Upload your latest resume/CV in PDF format
        </p>
      </div>
    </div>
  );
};

export default documentsTab;