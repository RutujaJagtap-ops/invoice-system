import { useEffect, useMemo, useRef } from "react";

export function useDebouncedCallback(callback, delay) {
  const callbackRef = useRef(callback);
  const timerRef = useRef(null);

  useEffect(() => {
    callbackRef.current = callback;
  });
  useEffect(() => () => clearTimeout(timerRef.current), []);

  return useMemo(() => {
    const debounced = (...args) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callbackRef.current(...args), delay);
    };
    debounced.cancel = () => clearTimeout(timerRef.current);
    return debounced;
  }, [delay]);
}