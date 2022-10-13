import omit from 'lodash/omit';

export const RESOLVED = 'RESOLVED';
export const REJECTED = 'REJECTED';

export const resolved = (type) => `${type}_${RESOLVED}`;
export const rejected = (type) => `${type}_${REJECTED}`;

export const middleware = (store) => (
  (next) => (
    (action) => {
      if (!action.promise) return next(action);
      const { promise, type } = action;
      const state = store.getState();

      // prevent unnecessary calls
      if (promise.shouldRequest && !promise.shouldRequest(state)) {
        return Promise.resolve(null);
      }

      const cleanAction = omit(action, 'promise');
      const newAction = { ...cleanAction };
      next(newAction);

      promise.promiseRequest
        .then((payload) => {
          const resolvedAction = { ...cleanAction, type: resolved(type), payload };

          // prevent unnecessary state updates
          if (promise.shouldFire && !promise.shouldFire(payload)) {
            throw new Error(payload);
          }

          next(resolvedAction);
        })
        .catch((payload) => {
          const rejectedAction = { ...cleanAction, type: rejected(type), payload };
          next(rejectedAction);
        });

      // trigger the request
      promise.promiseResolve();

      return promise;
    }
  )
);
