import React from 'react';

interface AlertProps {
  title: string;
  message: string;
  type?: 'error' | 'success' | 'warning';
}

const icons = {
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  ),
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  // Future icons for other types can be added here
};

const styles = {
  error: {
    container: 'bg-red-900/50 border-l-4 border-red-500',
    icon: 'text-red-400',
    title: 'text-red-200 font-bold',
    message: 'text-red-300',
  },
  success: {
    container: 'bg-green-900/50 border-l-4 border-green-500',
    icon: 'text-green-400',
    title: 'text-green-200 font-bold',
    message: 'text-green-300',
  },
  // Future styles for other types can be added here
};

export const Alert: React.FC<AlertProps> = ({ title, message, type = 'error' }) => {
  const style = styles[type] || styles['error'];
  const icon = icons[type] || icons['error'];

  if (!message) return null;

  return (
    <div className={`p-4 rounded-md flex items-start mb-6 ${style.container}`} role="alert">
      <div className={`flex-shrink-0 mr-4 ${style.icon}`}>
        {icon}
      </div>
      <div>
        <h3 className={`font-semibold ${style.title}`}>{title}</h3>
        <p className={`text-sm mt-1 ${style.message} whitespace-pre-wrap`}>{message}</p>
      </div>
    </div>
  );
};
