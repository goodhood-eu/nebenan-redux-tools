import { Reducer } from 'redux';

const isServerEnv = typeof window === 'undefined';

export type DefaultState = {
  activeRequestsCount: 0;
  isNetworkActive: false;
};
const getDefaultState = (): DefaultState => ({ activeRequestsCount: 0, isNetworkActive: false });

const reducer: Reducer = (state = getDefaultState(), action) => {
  if (isServerEnv || !action.meta || typeof action.meta.isRequestActive !== 'boolean') return state;

  const diff = action.meta.isRequestActive ? 1 : -1;

  const activeRequestsCount = Math.max(state.activeRequestsCount + diff, 0);
  const isNetworkActive = Boolean(activeRequestsCount);

  return { activeRequestsCount, isNetworkActive };
};

export default reducer;
