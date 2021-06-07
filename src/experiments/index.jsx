import defaults from 'lodash/defaults';

export const createVariation = (number) => Date.now() % number;

const createExperiments = (state, hash) => (
  Object.keys(hash).reduce((acc, key) => {
    acc[key] = typeof state[key] !== 'undefined' ? state[key] : createVariation(hash[key]);
    return acc;
  }, {})
);

export const updateExperiments = (current, randomExperiments, otherExperiments, overrides = {}) => {
  let updated = { ...current };

  if (randomExperiments) updated = createExperiments(current, randomExperiments);
  if (otherExperiments) defaults(updated, otherExperiments);
  if (overrides) updated = { ...updated, ...overrides };

  return updated;
};

export { useExperiments } from './hooks';
