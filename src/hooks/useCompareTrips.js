import { useState, useCallback } from 'react';

const MAX_SAVED = 4;

export function useCompareTrips() {
  const [savedTrips, setSavedTrips] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const save = useCallback(
    (data) => {
      let result = 'saved';
      setSavedTrips((prev) => {
        const exists = prev.some((t) => t.city === data.city && t.country === data.country);
        if (exists) {
          result = 'duplicate';
          return prev;
        }
        if (prev.length >= MAX_SAVED) {
          result = 'full';
          return prev;
        }
        return [...prev, { ...data }];
      });
      return result;
    },
    []
  );

  const remove = useCallback((index) => {
    setSavedTrips((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clear = useCallback(() => {
    setSavedTrips([]);
    setIsCompareOpen(false);
  }, []);

  return {
    savedTrips,
    save,
    remove,
    clear,
    isCompareOpen,
    openCompare: () => setIsCompareOpen(true),
    closeCompare: () => setIsCompareOpen(false),
    maxSaved: MAX_SAVED,
  };
}
