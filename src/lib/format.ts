const TL_FORMATTER = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
});

const COMPACT_TL = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 1,
  notation: 'compact',
});

const NUMBER_TR = new Intl.NumberFormat('tr-TR');

const PERCENT_TR = new Intl.NumberFormat('tr-TR', {
  style: 'percent',
  maximumFractionDigits: 0,
});

const DATE_REL = new Intl.RelativeTimeFormat('tr', { numeric: 'auto' });

export function formatTL(value: number, compact = false): string {
  return (compact ? COMPACT_TL : TL_FORMATTER).format(value);
}

export function formatSqm(value: number): string {
  return `${NUMBER_TR.format(value)} m²`;
}

export function formatPercent(value: number): string {
  return PERCENT_TR.format(value);
}

export function formatNumber(value: number): string {
  return NUMBER_TR.format(value);
}

export function formatRelative(iso: string): string {
  const target = new Date(iso).getTime();
  const diff = (target - Date.now()) / 1000;
  const absDiff = Math.abs(diff);
  if (absDiff < 60) return DATE_REL.format(Math.round(diff), 'second');
  if (absDiff < 3600) return DATE_REL.format(Math.round(diff / 60), 'minute');
  if (absDiff < 86400) return DATE_REL.format(Math.round(diff / 3600), 'hour');
  if (absDiff < 86400 * 7) return DATE_REL.format(Math.round(diff / 86400), 'day');
  if (absDiff < 86400 * 30) return DATE_REL.format(Math.round(diff / (86400 * 7)), 'week');
  if (absDiff < 86400 * 365) return DATE_REL.format(Math.round(diff / (86400 * 30)), 'month');
  return DATE_REL.format(Math.round(diff / (86400 * 365)), 'year');
}
