import { faker, fakerTR } from '@faker-js/faker';

// Deterministic seed — guarantees same data across reloads.
// Pick: 2026-05-13 (current date) as seed for stability + recall.
export const DETERMINISTIC_SEED = 20260513;

let initialized = false;

export function initFakerSeed(): void {
  if (initialized) return;
  faker.seed(DETERMINISTIC_SEED);
  fakerTR.seed(DETERMINISTIC_SEED);
  initialized = true;
}

export { faker, fakerTR };
