import omit from 'lodash/omit';

export const RESOLVED = 'RESOLVED';
export const REJECTED = 'REJECTED';

export const resolved = (type) => `${type}_${RESOLVED}`;
export const rejected = (type) => `${type}_${REJECTED}`;

export const middleware = (store) => (
  (next) => (
    (action) => {
      if (!action.promise) return next(action);
      const { promise: options, type } = action;
      const state = store.getState();

      // prevent unnecessary calls
      if (!options.shouldRequest?.(state)) {
        return Promise.resolve(null);
      }

      const cleanAction = omit(action, 'promise');
      const newAction = { ...cleanAction };
      next(newAction);

      let promise = options.getPromise?.();
      // legacy: options can be a raw promise
      // TODO: remove in next major release
      if (!promise) promise = options;

      promise
        .then((payload) => {
          const resolvedAction = { ...cleanAction, type: resolved(type), payload };
          next(resolvedAction);
        }, (payload) => {
          const rejectedAction = { ...cleanAction, type: rejected(type), payload };
          next(rejectedAction);
        });

      return promise;
    }
  )
);
