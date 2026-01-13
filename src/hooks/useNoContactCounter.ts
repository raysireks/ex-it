import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';

const NC_START_DATE_KEY = 'ncStartDate';

export const useNoContactCounter = () => {
  const [days, setDays] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStartDate = async () => {
      let startDateStr: string | null = null;

      if (user) {
        // Try Firestore first for authenticated users
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists() && userDoc.data().ncStartDate) {
          const timestamp = userDoc.data().ncStartDate as Timestamp;
          startDateStr = timestamp.toDate().toISOString();
          // Sync back to localStorage for consistency/offline support
          localStorage.setItem(NC_START_DATE_KEY, startDateStr);
        }
      }

      // Fallback to localStorage
      if (!startDateStr) {
        startDateStr = localStorage.getItem(NC_START_DATE_KEY);
      }

      if (!startDateStr) {
        // Initialize with current date if not set anywhere
        const now = new Date().toISOString();
        localStorage.setItem(NC_START_DATE_KEY, now);
        if (user) {
          await setDoc(doc(db, 'users', user.uid), { ncStartDate: Timestamp.fromDate(new Date(now)) }, { merge: true });
        }
        setDays(0);
        return;
      }

      const calculateDays = () => {
        const start = new Date(startDateStr!);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - start.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        setDays(diffDays);
      };

      calculateDays();
    };

    fetchStartDate();
    const interval = setInterval(fetchStartDate, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [user]);

  const reset = async () => {
    const nowStr = new Date().toISOString();
    localStorage.setItem(NC_START_DATE_KEY, nowStr);

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { ncStartDate: Timestamp.fromDate(new Date(nowStr)) }, { merge: true });
    }

    setDays(0);
  };

  return { days, reset };
};
