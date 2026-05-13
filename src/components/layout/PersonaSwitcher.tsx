import { cn } from '@/design/recipes';
import { PERSONAS, PERSONA_ORDER, type PersonaKey } from '@/lib/auth/personas';
import { useDemoIdentity } from '@/lib/auth/useDemoIdentity';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

export function PersonaSwitcher() {
  // Tree-shake guard — production build with VITE_DEMO_MODE=false eliminates this branch.
  if (!import.meta.env.VITE_DEMO_MODE) return null;

  const navigate = useNavigate();
  const { identity, setPersona } = useDemoIdentity();
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState<number>(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback(
    (key: PersonaKey) => {
      setPersona(key);
      setOpen(false);
      navigate(PERSONAS[key].routePrefix);
      buttonRef.current?.focus();
    },
    [setPersona, navigate],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'p') {
        event.preventDefault();
        setOpen((current) => !current);
      }
      if (event.key === 'Escape' && open) {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const idx = PERSONA_ORDER.indexOf(identity.key);
    setFocusIndex(idx >= 0 ? idx : 0);
  }, [open, identity.key]);

  const handleMenuKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setFocusIndex((i) => (i + 1) % PERSONA_ORDER.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setFocusIndex((i) => (i - 1 + PERSONA_ORDER.length) % PERSONA_ORDER.length);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const key = PERSONA_ORDER[focusIndex];
      if (key) handleSelect(key);
    }
  };

  return (
    <div className="relative" data-persona-switcher>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((c) => !c)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Demo persona değiştir — şu an: ${identity.label}`}
        className={cn(
          'inline-flex items-center gap-2 rounded-[var(--radius-md)] border px-3 py-1.5',
          'border-[var(--stroke-default)] bg-[var(--surface-elevated)]',
          'text-sm text-[var(--text-primary)] transition-colors',
          'hover:border-[var(--accent-cyan)] focus-visible:shadow-[var(--glow-cyan)]',
        )}
      >
        <span
          className="size-2 rounded-full"
          style={{ background: identity.avatarColor }}
          aria-hidden
        />
        <span className="font-medium">{identity.label}</span>
        <span className="text-[var(--text-tertiary)]">⌃⇧P</span>
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Persona seçimi"
          tabIndex={-1}
          onKeyDown={handleMenuKey}
          className={cn(
            'absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-[var(--radius-md)]',
            'border border-[var(--stroke-default)] bg-[var(--surface-elevated)]',
            'shadow-[var(--glow-soft)] backdrop-blur-xl',
          )}
        >
          <div className="px-3 py-2 text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
            Demo Persona
          </div>
          {PERSONA_ORDER.map((key, idx) => {
            const persona = PERSONAS[key];
            const active = identity.key === key;
            const focused = focusIndex === idx;
            return (
              <button
                key={key}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => handleSelect(key)}
                onMouseEnter={() => setFocusIndex(idx)}
                className={cn(
                  'flex w-full items-center gap-3 px-3 py-2 text-left',
                  'transition-colors',
                  focused ? 'bg-[var(--surface-slate)]' : 'bg-transparent',
                  active && 'text-[var(--accent-cyan)]',
                )}
              >
                <span
                  className="size-3 shrink-0 rounded-full"
                  style={{ background: persona.avatarColor }}
                  aria-hidden
                />
                <span className="flex-1">
                  <span className="block text-sm font-medium">{persona.label}</span>
                  <span className="block text-xs text-[var(--text-tertiary)]">
                    {persona.description}
                  </span>
                </span>
                {active && (
                  <span aria-hidden className="text-[var(--accent-cyan)]">
                    ●
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
