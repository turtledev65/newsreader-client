import { useEffect, useState } from "react";

export default function useLocalStorage<T>(
  key: string,
  defaultVal: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    const val = localStorage.getItem(key);
    if (val === null) return defaultVal;
    else
      try {
        return JSON.parse(val) as T;
      } catch (_) {
        return defaultVal;
      }
  });

  useEffect(() => {
    if (state === undefined || state === null) {
      localStorage.removeItem(key);
      return;
    }
    localStorage.setItem(key, JSON.stringify(state));
  }, [state]);

  return [state, setState];
}
