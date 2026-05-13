import { Button } from '@/components/ui/Button';
import { cn } from '@/design/recipes';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect } from 'react';

export type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
  enableKeyboard?: boolean;
};

function buildPages(page: number, pageCount: number): Array<number | 'ellipsis'> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  const out: Array<number | 'ellipsis'> = [1];
  const left = Math.max(2, page - 1);
  const right = Math.min(pageCount - 1, page + 1);
  if (left > 2) out.push('ellipsis');
  for (let i = left; i <= right; i += 1) out.push(i);
  if (right < pageCount - 1) out.push('ellipsis');
  out.push(pageCount);
  return out;
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  className,
  enableKeyboard = true,
}: PaginationProps) {
  const pages = buildPages(page, pageCount);
  const canPrev = page > 1;
  const canNext = page < pageCount;

  const goto = useCallback(
    (next: number) => {
      const bounded = Math.min(Math.max(1, next), pageCount);
      if (bounded !== page) onPageChange(bounded);
    },
    [page, pageCount, onPageChange],
  );

  useEffect(() => {
    if (!enableKeyboard) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest('input,textarea,select')) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goto(page - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goto(page + 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enableKeyboard, goto, page]);

  return (
    <nav
      aria-label="Sayfalama"
      className={cn('flex items-center justify-between gap-2', className)}
    >
      <Button
        type="button"
        tone="ghost"
        size="sm"
        disabled={!canPrev}
        onClick={() => goto(page - 1)}
        leftIcon={<ChevronLeft className="size-4" aria-hidden />}
        aria-label="Önceki sayfa"
      >
        Önceki
      </Button>
      <ul className="hidden items-center gap-1 sm:flex">
        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <li
              // eslint-disable-next-line react/no-array-index-key
              key={`ell-${i}`}
              className="px-2 text-[var(--text-tertiary)]"
              aria-hidden
            >
              …
            </li>
          ) : (
            <li key={p}>
              <Button
                type="button"
                tone={p === page ? 'primary' : 'ghost'}
                size="sm"
                aria-current={p === page ? 'page' : undefined}
                onClick={() => goto(p)}
              >
                {p}
              </Button>
            </li>
          ),
        )}
      </ul>
      <span className="text-xs text-[var(--text-tertiary)] sm:hidden">
        {page} / {pageCount}
      </span>
      <Button
        type="button"
        tone="ghost"
        size="sm"
        disabled={!canNext}
        onClick={() => goto(page + 1)}
        rightIcon={<ChevronRight className="size-4" aria-hidden />}
        aria-label="Sonraki sayfa"
      >
        Sonraki
      </Button>
    </nav>
  );
}
