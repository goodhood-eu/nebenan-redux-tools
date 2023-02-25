import { useShallowEqualSelector } from '../utils';
import { State } from './types';

type RootState = {
  // Relies on the app mapping the reducer on the 'experiments' key
  experiments: State,
};

const selectExperiments = ({ experiments }: RootState) => experiments;
export const useExperiments = () => (
  useShallowEqualSelector<RootState>(selectExperiments)
);
