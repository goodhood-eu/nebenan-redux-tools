import omit from 'lodash/omit';

export const RESOLVED = 'RESOLVED';
export const REJECTED = 'REJECTED';

export const resolved = (type) => `${type}_${RESOLVED}`;
export const rejected = (type) => `${type}_${REJECTED}`;

export const middleware = () => (
  (next) => (
    (action) => {
      if (!action.promise) return next(action);
      const { promise, type } = action;
      const cleanAction = omit(action, 'promise');

      const newAction = { ...cleanAction };
      next(newAction);

      // prevent unnecessary calls
      // handle shouldRequest somehow, state is missing?
      // eslint-disable-next-line max-len
      // if (promise.shouldFire && !promise.shouldFire(action.payload)) return Promise.resolve(null);

      console.log('promise middleware ');
      console.log(promise);

      promise.requestPromise
        .then((payload) => {
          const resolvedAction = { ...cleanAction, type: resolved(type), payload };
          next(resolvedAction);
        })
        .catch((payload) => {
          const rejectedAction = { ...cleanAction, type: rejected(type), payload };
          next(rejectedAction);
        });

      return promise;
    }
  )
);
