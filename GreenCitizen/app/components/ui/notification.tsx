import React, { useEffect } from 'react';

export type NotificationVariant = 'success' | 'error' | 'info';

export interface NotificationProps {
  variant?: NotificationVariant;
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
  className?: string;
}

export const Notification: React.FC<NotificationProps> = ({
  variant = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  className = ''
}) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`notification notification-${variant} ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold mb-1">{title}</h4>
          )}
          <p className="text-sm">{message}</p>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="text-current opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close notification"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Notification;