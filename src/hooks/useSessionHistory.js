import { useState, useCallback } from 'react';

export function useSessionHistory() {
  const [history, setHistory] = useState([]);

  const push = useCallback((data) => {
    setHistory((prev) => {
      const next = [{ ...data, _builtAt: Date.now() }, ...prev];
      return next.slice(0, 8);
    });
  }, []);

  return { history, push };
}
