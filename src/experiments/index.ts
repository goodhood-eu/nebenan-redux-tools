import defaults from 'lodash/defaults';

export const createVariation = (number: number): number => Date.now() % number;

const createExperiments = (state: Record<string, unknown>, hash: Record<string, number>) => (
  Object.keys(hash).reduce((acc, key) => {
    acc[key] = typeof state[key] !== 'undefined' ? state[key] : createVariation(hash[key]);
    return acc;
  }, {} as Record<string, unknown>)
);

export const updateExperiments = (
  current: Record<string, unknown>,
  randomExperiments: Record<string, number>,
  otherExperiments: Record<string, unknown>,
  overrides: Record<string, unknown>,
) => {
  let updated = { ...current };

  if (randomExperiments) updated = createExperiments(current, randomExperiments);
  if (otherExperiments) defaults(updated, otherExperiments);
  if (overrides) updated = { ...updated, ...overrides };

  return updated;
};

export { useExperiments } from './hooks';
