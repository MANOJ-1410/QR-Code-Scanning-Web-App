
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [options, ] = useState({
    position: "top-right",
    autoClose: 1000,
    limit: 1,
    hideProgressBar: false,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    theme: "light",


    
  });

  const showToast = (message, type = 'success') => {
    switch (type) {
      case 'error':
        toast.error(message, options);
        break;
      default:
        toast.success(message, options);
        break;
    }
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
    </ToastContext.Provider>
  );
}
