import { useState, useEffect } from 'react';

const NC_START_DATE_KEY = 'ncStartDate';

export const useNoContactCounter = () => {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const startDate = localStorage.getItem(NC_START_DATE_KEY);
    
    if (!startDate) {
      // Initialize with current date if not set
      const now = new Date().toISOString();
      localStorage.setItem(NC_START_DATE_KEY, now);
      setDays(0);
      return;
    }

    const calculateDays = () => {
      const start = new Date(startDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - start.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      setDays(diffDays);
    };

    calculateDays();
    const interval = setInterval(calculateDays, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const reset = () => {
    const now = new Date().toISOString();
    localStorage.setItem(NC_START_DATE_KEY, now);
    setDays(0);
  };

  return { days, reset };
};
