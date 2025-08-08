import React from 'react';

const navigationTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: 'personal',
      label: 'Personal Info',
      icon: 'bx-user'
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'bx-lock-alt'
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: 'bx-file'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <nav className="flex flex-col">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
              activeTab === tab.id 
                ? 'border-l-4 border-blue-600 bg-blue-50' 
                : 'border-l-4 border-transparent'
            }`}
          >
            <i className={`bx ${tab.icon} mr-3 ${
              activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'
            }`}></i>
            <span className={
              activeTab === tab.id 
                ? 'font-semibold text-blue-600' 
                : 'text-gray-700'
            }>
              {tab.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default navigationTabs;