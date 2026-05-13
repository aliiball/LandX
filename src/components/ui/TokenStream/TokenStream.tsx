import { cn } from '@/design/recipes';
import { useEffect, useRef, useState } from 'react';

export type TokenStreamProps = {
  /** Tokens to emit. When a new array reference is passed, replays. */
  tokens?: ReadonlyArray<string>;
  /** Optional live stream of tokens (for real SSE later). */
  stream?: ReadableStream<string> | null;
  /** Milliseconds between tokens for `tokens` array mode. */
  intervalMs?: number;
  /** Called once when streaming is complete. */
  onComplete?: () => void;
  className?: string;
};

/**
 * Renders tokens one-by-one with a blinking caret. Used for AI streaming UIs.
 *
 * Reduce-motion: renders the full text immediately without caret blink.
 */
export function TokenStream({
  tokens,
  stream,
  intervalMs = 28,
  onComplete,
  className,
}: TokenStreamProps) {
  const [emitted, setEmitted] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const reduceMotion = useReduceMotion();
  const consumedRef = useRef(false);

  // Tokens-array mode: timer-driven emission, replays on new tokens reference
  useEffect(() => {
    if (!tokens) return;
    setEmitted([]);
    setDone(false);
    if (reduceMotion) {
      setEmitted([...tokens]);
      setDone(true);
      onComplete?.();
      return;
    }
    let cancelled = false;
    let index = 0;
    const tick = () => {
      if (cancelled) return;
      const next = tokens[index];
      if (next === undefined) {
        setDone(true);
        onComplete?.();
        return;
      }
      setEmitted((prev) => [...prev, next]);
      index += 1;
      timer = window.setTimeout(tick, intervalMs);
    };
    let timer = window.setTimeout(tick, intervalMs);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [tokens, intervalMs, reduceMotion, onComplete]);

  // ReadableStream mode (real SSE)
  useEffect(() => {
    if (!stream) return;
    if (consumedRef.current) return;
    consumedRef.current = true;
    setEmitted([]);
    setDone(false);
    let cancelled = false;
    const reader = stream.getReader();
    (async () => {
      try {
        while (!cancelled) {
          const { value, done: streamDone } = await reader.read();
          if (streamDone) break;
          if (value !== undefined) setEmitted((prev) => [...prev, value]);
        }
      } catch (err) {
        console.warn('[TokenStream] read failed:', err);
      } finally {
        if (!cancelled) {
          setDone(true);
          onComplete?.();
        }
      }
    })();
    return () => {
      cancelled = true;
      void reader.cancel();
      consumedRef.current = false;
    };
  }, [stream, onComplete]);

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn('inline-flex flex-wrap items-baseline whitespace-pre-wrap', className)}
    >
      <span>{emitted.join('')}</span>
      {!done && <span aria-hidden className="token-caret ml-0.5 h-[1em]" />}
    </span>
  );
}

function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduce;
}

/**
 * Convert a string into a deterministic token array suitable for `TokenStream`.
 * Splits on whitespace boundaries while preserving spacing.
 */
export function tokenize(text: string): ReadonlyArray<string> {
  return text.match(/\S+\s*|\s+/g) ?? [];
}
