import React from "react";
import { colorThemes } from './colorThemes';


export const themeSwitcher = ({ theme, setTheme }) => {
    
    
  return (
    <div className="fixed top-4 right-4 z-50 flex space-x-2">
      {Object.keys(colorThemes).map(themeKey => (
        <button
          key={themeKey}
          onClick={() => setTheme(themeKey)}
          className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
            theme === themeKey ? 'scale-110 border-white' : 'border-gray-400 hover:border-white'
          } ${
            themeKey === 'blue' ? 'bg-gradient-to-r from-blue-500 to-purple-600' :
            themeKey === 'green' ? 'bg-gradient-to-r from-green-500 to-teal-600' :
            'bg-gradient-to-r from-orange-500 to-red-600'
          }`}
        />
      ))}
    </div>
  );
}
export default themeSwitcher;