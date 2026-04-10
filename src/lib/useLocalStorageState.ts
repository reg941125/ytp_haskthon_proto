import { useEffect, useState } from "react";

type Serializer<T> = (v: T) => string;
type Parser<T> = (raw: string) => T;

export function useLocalStorageState<T>(
  key: string,
  initialValue: T,
  options?: {
    serialize?: Serializer<T>;
    parse?: Parser<T>;
  }
): [T, (next: T | ((prev: T) => T)) => void] {
  const serialize = options?.serialize ?? ((v: T) => JSON.stringify(v));
  const parse = options?.parse ?? ((raw: string) => JSON.parse(raw) as T);

  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) setState(parse(raw));
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set: (next: T | ((prev: T) => T)) => void = (next) => {
    setState((prev) => {
      const computed = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      try {
        window.localStorage.setItem(key, serialize(computed));
      } catch {
        // ignore
      }
      return computed;
    });
  };

  return [state, set];
}

