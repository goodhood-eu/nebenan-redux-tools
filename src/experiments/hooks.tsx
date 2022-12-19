import { useShallowEqualSelector } from '../utils';

type ExperimentsStoreType = {
  experiments: Record<string, unknown>
};

const selectExperiments = (
  { experiments }: { experiments: ExperimentsStoreType['experiments'] },
): ExperimentsStoreType['experiments'] => experiments;
export const useExperiments = () => (
  useShallowEqualSelector<ExperimentsStoreType>(selectExperiments)
);
