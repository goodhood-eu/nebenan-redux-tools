import defaults from 'lodash/defaults';

export const createVariation = (number) => Date.now() % number;

const createExperiments = (state, hash) => (
  Object.keys(hash).reduce((acc, key) => {
    acc[key] = typeof state[key] !== 'undefined' ? state[key] : createVariation(hash[key]);
    return acc;
  }, {})
);

export const updateExperiments = (current, configHash, overrides) => {
  let updated = { ...current };

  if (configHash) updated = createExperiments(current, configHash);
  if (overrides) defaults(updated, overrides);

  return updated;
};
