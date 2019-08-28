const isServerEnv = (
  typeof process !== 'undefined' && process && process.versions && process.versions.node
);

const getDefaultState = () => ({ activeRequestsCount: 0, isNetworkActive: false });

export default (state = getDefaultState(), action) => {
  if (isServerEnv || !action.meta || typeof action.meta.isRequestActive !== 'boolean') return state;

  const diff = action.meta.isRequestActive ? 1 : -1;

  const activeRequestsCount = Math.max(state.activeRequestsCount + diff, 0);
  const isNetworkActive = Boolean(activeRequestsCount);

  return { activeRequestsCount, isNetworkActive };
};
