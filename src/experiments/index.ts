import defaults from 'lodash/defaults';
import { Experiments, RandomExperimentSetup } from './types';

export const createVariation = (number: number): number => Date.now() % number;

const createRandomExperiments = (
  state: Experiments,
  hash: RandomExperimentSetup,
): Experiments => (
  Object.keys(hash).reduce((acc, key) => {
    acc[key] = typeof state[key] !== 'undefined' ? state[key] : createVariation(hash[key]);
    return acc;
  }, {} as Experiments)
);

export const updateExperiments = (
  current: Experiments,
  randomExperiments?: RandomExperimentSetup,
  otherExperiments?: Experiments,
  overrides?: Experiments,
): Experiments => {
  let updated = { ...current };

  if (randomExperiments) updated = createRandomExperiments(current, randomExperiments);
  if (otherExperiments) defaults(updated, otherExperiments);
  if (overrides) updated = { ...updated, ...overrides };

  return updated;
};

export { useExperiments } from './hooks';
