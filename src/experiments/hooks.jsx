import { useShallowEqualSelector } from '../utils';

const selectExperiments = ({ experiments }) => experiments;
export const useExperiments = () => useShallowEqualSelector(selectExperiments);
