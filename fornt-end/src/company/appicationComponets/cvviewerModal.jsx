import React from 'react';
import { X, Download, Eye, FileText } from 'lucide-react';
import { getAuthToken } from '../../services/Company/viewAppication';
const CVViewerModal = ({ 
  showCVModal, 
  selectedCV, 
  selectedApplication, 
  cvLoadError, 
  setCvLoadError, 
  onClose, 
  onCVDownload 
}) => {
  if (!showCVModal) return null;

  const handleOpenNewTab = async () => {
    const token = getAuthToken();
    if (token) {
      try {
        const response = await fetch(selectedCV, {
          method: 'HEAD',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          window.open(selectedCV, '_blank');
        } else {
          console.error('URL not accessible:', response.status);
          alert(`Cannot access CV: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error testing URL:', error);
        alert('Cannot access CV. Please try downloading instead.');
      }
    } else {
      alert('Authentication required');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-5xl w-full h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-semibold">CV Preview</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onCVDownload(selectedApplication?.cvUrl || selectedCV)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download CV
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-hidden">
          <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
            {selectedCV && !cvLoadError ? (
              <div className="w-full h-full relative">
                {/* Try iframe first */}
                <iframe
                  src={`${selectedCV}#toolbar=1&navpanes=1&scrollbar=1`}
                  className="w-full h-full border-0"
                  title="CV Preview"
                  onLoad={() => setCvLoadError(false)}
                  onError={(e) => {
                    console.error('PDF iframe load error:', e);
                    setCvLoadError(true);
                  }}
                  style={{ backgroundColor: 'white' }}
                />

                {/* Fallback: Try object embed */}
                {cvLoadError && (
                  <object
                    data={selectedCV}
                    type="application/pdf"
                    className="w-full h-full"
                    onError={() => {
                      console.error('PDF object embed failed');
                      setCvLoadError(true);
                    }}
                  >
                    <embed
                      src={selectedCV}
                      type="application/pdf"
                      className="w-full h-full"
                      onError={() => {
                        console.error('PDF embed failed');
                        setCvLoadError(true);
                      }}
                    />
                  </object>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center flex-col">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">
                  {cvLoadError ? 'Cannot preview PDF in browser' : 'No CV selected'}
                </p>
                <p className="text-sm text-gray-500 mb-4 text-center max-w-md">
                  {cvLoadError
                    ? 'Your browser may not support PDF preview. Try downloading or opening in a new tab.'
                    : 'Select a CV to preview'}
                </p>

                {selectedCV && (
                  <div className="flex gap-3">
                    <button
                      onClick={handleOpenNewTab}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Open in New Tab
                    </button>
                    <button
                      onClick={() => onCVDownload(selectedApplication?.cvUrl || selectedCV)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download CV
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVViewerModal;