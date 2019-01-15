export default (state = {}, action) => {
  if (action.meta && typeof action.meta.isRequestActive === 'boolean') {
    const diff = action.meta.isRequestActive ? 1 : -1;

    const activeRequestsCount = Math.max((state.activeRequestsCount || 0) + diff, 0);
    const isNetworkActive = Boolean(activeRequestsCount);

    return { activeRequestsCount, isNetworkActive };
  }

  return state;
};
