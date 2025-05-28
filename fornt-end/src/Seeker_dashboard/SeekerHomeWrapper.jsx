import React from 'react';
import { useOutletContext } from 'react-router-dom';
import SK_loadPost from './SK_loadPost';

const SeekerHomeWrapper = () => {
  // Get the entire context safely
  let contextValue;
  try {
    contextValue = useOutletContext();
    
  } catch (error) {
   
    contextValue = {};
  }

  // Get userData safely with a fallback
  const userData = contextValue?.userData || {};
  
  return <SK_loadPost fullName={userData?.fullName} />;
};

export default SeekerHomeWrapper;