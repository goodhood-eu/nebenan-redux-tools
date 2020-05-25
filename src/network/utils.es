export const DEFAULT_CACHING_TIME = 1000 * 60 * 2;

export const isExpired = (state, time = DEFAULT_CACHING_TIME) => (
  Date.now() - state.lastFetched > time
);

export const isFetchable = (state, size) => {
  if (typeof state.total !== 'number') return true;
  return state.total >= size && state.collection.length < size;
};

export const getTotalCount = (collection, result) => {
  if (!collection || !Array.isArray(collection)) return;
  const resultLength = result ? result.length : 0;
  return collection.length + (resultLength * 2);
};
