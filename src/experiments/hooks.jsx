import { useShallowEqualSelector } from 'nebenan-react-hocs/lib/redux_hooks';

const selectExperiments = ({ experiments }) => experiments;
export const useExperiments = () => useShallowEqualSelector(selectExperiments);
