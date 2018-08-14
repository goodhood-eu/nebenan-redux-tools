export default (state = {}, action) => {
  if (action.meta && typeof action.meta.isNetworkActive === 'boolean') {
    const isNetworkActive = action.meta.isNetworkActive;
    let activeCount = state.activeCount || 0;
    if (isNetworkActive) activeCount += 1;
    else activeCount -= 1;

    return { activeCount, isNetworkActive };
  }

  return state;
};
