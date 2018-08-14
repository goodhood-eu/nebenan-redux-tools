export const DEFAULT_CACHING_TIME = 1000 * 60 * 2;

export const isExpired = (state, time = DEFAULT_CACHING_TIME) => (
  Date.now() - state.lastFetched > time
);

export const isFetchable = (state, size) => {
  if (typeof state.total !== 'number') return true;
  return state.total >= size && state.collection.length < size;
};
