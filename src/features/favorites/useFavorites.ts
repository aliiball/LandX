import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'landx_favorites';

function read(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((v): v is string => typeof v === 'string'));
  } catch {
    return new Set();
  }
}

function write(set: Set<string>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  window.dispatchEvent(new CustomEvent('landx:favorites-changed'));
}

export function useFavorites() {
  const [ids, setIds] = useState<Set<string>>(() => read());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sync = () => setIds(read());
    window.addEventListener('landx:favorites-changed', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('landx:favorites-changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      write(next);
      return next;
    });
  }, []);

  const has = useCallback((id: string) => ids.has(id), [ids]);

  return { ids, toggle, has, count: ids.size };
}
