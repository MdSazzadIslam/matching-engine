import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const isServerError = (message: string): boolean => {
    return message.toLowerCase().includes('server') || 
           message.toLowerCase().includes('timed out') ||
           message.toLowerCase().includes('not responding');
  };

  const errorClass = isServerError(message) ? 'server-error' : 'default-error';
  
  return (
    <div className={`alert ${errorClass}`}>
      <div className="alert-title">
        {isServerError(message) ? 'Server Error' : 'Error'}
      </div>
      <div className="alert-description">
        {message}
        {isServerError(message) && (
          <div className="alert-suggestion">
            Please check if the server is running and try again.
          </div>
        )}
      </div>
    </div>
  );
};