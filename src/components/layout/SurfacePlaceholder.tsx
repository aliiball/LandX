import { cn, glassRecipe, headingRecipe } from '@/design/recipes';
import { useTranslation } from 'react-i18next';

type SurfacePlaceholderProps = {
  surfaceKey: string;
  title: string;
  subtitle?: string;
  accent?: 'cyan' | 'violet' | 'lime' | 'amber' | 'magenta';
};

const ACCENT_MAP = {
  cyan: 'var(--accent-cyan)',
  violet: 'var(--accent-violet)',
  lime: 'var(--accent-lime)',
  amber: 'var(--accent-amber)',
  magenta: 'var(--accent-magenta)',
} as const;

export function SurfacePlaceholder({
  surfaceKey,
  title,
  subtitle,
  accent = 'cyan',
}: SurfacePlaceholderProps) {
  const { t } = useTranslation();
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-start gap-6 px-6 py-12">
      <span
        className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-tertiary)]"
        aria-label={t('placeholder.surfaceLabel', { defaultValue: 'Surface' })}
      >
        {surfaceKey}
      </span>
      <h1 className={headingRecipe({ level: 'h1' })} style={{ color: ACCENT_MAP[accent] }}>
        {title}
      </h1>
      {subtitle && <p className="max-w-2xl text-[var(--text-secondary)]">{subtitle}</p>}
      <section
        className={cn(
          glassRecipe({ tone: 'default', glow: 'soft' }),
          'flex w-full flex-col gap-3 p-6',
        )}
      >
        <h2 className="text-lg font-medium">
          {t('placeholder.workInProgressTitle', {
            defaultValue: 'Bu sayfa Phase 0 iskeletinin parçasıdır.',
          })}
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          {t('placeholder.workInProgressBody', {
            defaultValue:
              'Gerçek içerik ilerleyen fazlarda eklenecek. Persona Switcher ile diğer yüzeylere geçiş yapabilirsiniz (Ctrl+Shift+P).',
          })}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            className="rounded-[var(--radius-md)] border border-[var(--stroke-default)] bg-[var(--surface-elevated)] px-4 py-2 text-sm font-medium hover:border-[var(--accent-cyan)] hover:shadow-[var(--glow-cyan)] focus-visible:shadow-[var(--glow-cyan)]"
            onClick={() => {
              // No-op for Phase 0; real action lands in Phase 1+. Provide visible feedback.
              const evt = new CustomEvent('landx:placeholder-action', { detail: { surfaceKey } });
              window.dispatchEvent(evt);
            }}
          >
            {t('placeholder.cta', { defaultValue: 'Yakında' })}
          </button>
        </div>
      </section>
    </main>
  );
}
