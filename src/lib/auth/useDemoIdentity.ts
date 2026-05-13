import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_PERSONA,
  PERSONAS,
  type PersonaIdentity,
  type PersonaKey,
  SESSION_STORAGE_KEY,
} from './personas';

function readStoredPersona(): PersonaKey {
  if (typeof window === 'undefined') return DEFAULT_PERSONA;
  const url = new URL(window.location.href);
  const queryParam = url.searchParams.get('persona');
  if (queryParam && queryParam in PERSONAS) {
    return queryParam as PersonaKey;
  }
  const stored = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (stored && stored in PERSONAS) {
    return stored as PersonaKey;
  }
  return DEFAULT_PERSONA;
}

/**
 * Demo-only identity hook (R-01). In production builds this hook still resolves,
 * but the PersonaSwitcher component is tree-shaken so the active persona is always
 * DEFAULT_PERSONA.
 */
export function useDemoIdentity(): {
  identity: PersonaIdentity;
  setPersona: (key: PersonaKey) => void;
} {
  const [personaKey, setPersonaKey] = useState<PersonaKey>(readStoredPersona);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => setPersonaKey(readStoredPersona());
    window.addEventListener('storage', handler);
    window.addEventListener('popstate', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('popstate', handler);
    };
  }, []);

  const setPersona = useCallback((key: PersonaKey) => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, key);
    const url = new URL(window.location.href);
    url.searchParams.set('persona', key);
    window.history.replaceState({}, '', url.toString());
    setPersonaKey(key);
  }, []);

  const identity = PERSONAS[personaKey];
  return { identity, setPersona };
}
