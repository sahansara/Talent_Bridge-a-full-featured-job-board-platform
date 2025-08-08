import React, { useState } from 'react';


export const colorThemes = {
  
  blue: {
    primary: 'from-blue-500 to-blue-600',
    secondary: 'from-blue-400 to-blue-500',
    accent: 'from-cyan-400 to-blue-500',
    bg: 'from-slate-900 via-blue-900 to-slate-900'
  },
  green: {
    primary: 'from-green-500 to-teal-600',
    secondary: 'from-emerald-400 to-green-500',
    accent: 'from-teal-400 to-green-500',
    bg: 'from-slate-900 via-green-900 to-slate-900'
  },
  orange: {
    primary: 'from-orange-500 to-red-600',
    secondary: 'from-orange-400 to-red-500',
    accent: 'from-yellow-400 to-orange-500',
    bg: 'from-slate-900 via-orange-900 to-slate-900'
  }
};