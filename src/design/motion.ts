// Motion presets — PROMPT §2.4
// Use these constants instead of magic numbers in animations.

export const easing = {
  outExpo: [0.2, 0.8, 0.2, 1] as const,
  outQuart: [0.165, 0.84, 0.44, 1] as const,
  inOutCubic: [0.65, 0, 0.35, 1] as const,
} as const;

export const duration = {
  micro: 0.12,
  small: 0.2,
  medium: 0.32,
  layout: 0.48,
  scene: 0.72,
} as const;

export const stagger = {
  list: 0.05,
  cards: 0.06,
} as const;

export type EasingPreset = keyof typeof easing;
export type DurationPreset = keyof typeof duration;

export const reduceMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: duration.small },
} as const;

export const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: duration.medium, ease: easing.outExpo },
} as const;
