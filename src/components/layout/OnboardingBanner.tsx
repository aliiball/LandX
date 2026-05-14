import { Badge, Button, Icon } from '@/components/ui';
import { Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'landx_onboarded';

export function OnboardingBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const v = window.localStorage.getItem(STORAGE_KEY);
      if (!v) setShow(true);
    } catch {
      // ignore
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
  };

  if (!show) return null;
  return (
    <div className="sticky top-0 z-[45] border-b border-[var(--stroke-subtle)] bg-gradient-to-r from-[var(--accent-violet)]/15 via-[var(--surface-elevated)] to-[var(--accent-cyan)]/15 px-4 py-2 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
        <Badge tone="agent" size="sm" dot>
          Yeni
        </Badge>
        <Icon icon={Sparkles} size={14} tone="violet" />
        <span className="flex-1 text-xs sm:text-sm">
          arsam.net demo modunda. <strong>Ctrl+K</strong> ile her sayfaya atlayın,{' '}
          <strong>Ctrl+Shift+P</strong> ile persona değiştirin. AI asistana sağ-alttaki ✨
          butonundan ulaşın.
        </span>
        <Button size="sm" tone="ghost" onClick={dismiss}>
          Anladım
        </Button>
        <button
          type="button"
          aria-label="Onboarding bannerını kapat"
          onClick={dismiss}
          className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
        >
          <Icon icon={X} size={14} />
        </button>
      </div>
    </div>
  );
}
