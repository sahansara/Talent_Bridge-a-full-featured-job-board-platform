import React from 'react';
import { X } from 'lucide-react';

const ThumbnailUpload = ({ 
  thumbnailPreview, 
  handleThumbnailChange, 
  removeThumbnail 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Upload Thumbnail
      </label>
      <div className="bg-gray-50 p-4 border-2 border-dashed border-gray-300 rounded-lg">
        {thumbnailPreview ? (
          <div className="relative">
            <img
              src={thumbnailPreview}
              alt="Thumbnail preview"
              className="w-full h-48 object-cover rounded-md"
            />
            <button
              type="button"
              onClick={removeThumbnail}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
            >
              <X size={16} className="text-gray-600" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 space-y-2">
            <div className="w-16 h-16 bg-blue-100 rounded-md flex items-center justify-center">
              <img 
                src="/api/placeholder/64/64" 
                alt="Placeholder" 
                className="w-12 h-12"
              />
            </div>
            <div className="text-center">
              <label className="cursor-pointer text-blue-600 hover:text-blue-800 block mb-1">
                <span>Upload Thumbnail</span>
                <input
                  type="file"
                  onChange={handleThumbnailChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>
              <span className="text-xs text-gray-500">JPG, PNG or GIF (max. 2MB)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThumbnailUpload;