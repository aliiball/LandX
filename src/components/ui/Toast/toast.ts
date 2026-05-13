import { toast as sonnerToast } from 'sonner';

type ToastInput = string | { title: string; description?: string };

function normalize(input: ToastInput): { title: string; description?: string } {
  return typeof input === 'string' ? { title: input } : input;
}

export const toast = {
  show: (input: ToastInput) => {
    const { title, description } = normalize(input);
    return sonnerToast(title, { description });
  },
  success: (input: ToastInput) => {
    const { title, description } = normalize(input);
    return sonnerToast.success(title, { description });
  },
  error: (input: ToastInput) => {
    const { title, description } = normalize(input);
    return sonnerToast.error(title, { description });
  },
  info: (input: ToastInput) => {
    const { title, description } = normalize(input);
    return sonnerToast.info(title, { description });
  },
  warning: (input: ToastInput) => {
    const { title, description } = normalize(input);
    return sonnerToast.warning(title, { description });
  },
  /** Magenta agent notification — used by AI tools / human-in-the-loop. */
  agent: (input: ToastInput) => {
    const { title, description } = normalize(input);
    return sonnerToast(title, {
      description,
      className: 'landx-toast-agent',
      style: {
        '--normal-text': 'var(--accent-magenta)',
      } as React.CSSProperties,
    });
  },
  /** Cyan system notification — info from platform. */
  system: (input: ToastInput) => {
    const { title, description } = normalize(input);
    return sonnerToast(title, {
      description,
      className: 'landx-toast-system',
      style: {
        '--normal-text': 'var(--accent-cyan)',
      } as React.CSSProperties,
    });
  },
  dismiss: (id?: string | number) => sonnerToast.dismiss(id),
  promise: sonnerToast.promise,
};

export type ToastApi = typeof toast;
