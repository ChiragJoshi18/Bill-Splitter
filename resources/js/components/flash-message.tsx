import { useEffect, useState } from 'react';

interface FlashMessageProps {
  success?: string;
  error?: string;
  warning?: string;
  info?: string;
}

export default function FlashMessage({ success, error, warning, info }: FlashMessageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (success) {
      setMessage(success);
      setIsVisible(true);
    } else if (error) {
      setMessage(error);
      setIsVisible(true);
    } else if (warning) {
      setMessage(warning);
      setIsVisible(true);
    } else if (info) {
      setMessage(info);
      setIsVisible(true);
    }

    // Auto-hide after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [success, error, warning, info]);

  if (!isVisible || !message) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border rounded px-3 py-2 text-sm">
      {message}
    </div>
  );
} 