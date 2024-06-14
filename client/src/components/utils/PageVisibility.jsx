import { useEffect, useState } from 'react';

const PageVisibility = () => {
  const [isPageVisible, setIsPageVisible] = useState(true);

  const handleVisibilityChange = () => {
    setIsPageVisible(!document.hidden);
  };

  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = '';
  };

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return isPageVisible;
};

export default PageVisibility;