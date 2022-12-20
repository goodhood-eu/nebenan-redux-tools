import { Middleware } from 'redux';
import { AxiosResponse } from 'axios';
import { getErrorHandler } from './configuration';

export { configurePromise } from './configuration';

export const RESOLVED = 'RESOLVED';
export const REJECTED = 'REJECTED';

export const resolved = (type: string): string => `${type}_${RESOLVED}`;
export const rejected = (type: string): string => `${type}_${REJECTED}`;

export const middleware: Middleware = (store) => (
  (next) => (
    (action) => {
      if (!action.promise) return next(action);

      const { promise: options, ...cleanAction } = action;
      const state = store.getState();

      // prevent unnecessary calls
      if (options.shouldExecute && !options.shouldExecute(state)) {
        return Promise.resolve(null);
      }

      next(cleanAction);

      let promise = options.getPromise?.();

      // legacy: options can be a raw promise
      // TODO: remove in next major release
      if (!promise) promise = options;

      return promise
        .then((payload: AxiosResponse) => {
          next({ ...cleanAction, type: resolved(action.type), payload });
        }, (payload: AxiosResponse) => {
          next({ ...cleanAction, type: rejected(action.type), payload });

          getErrorHandler()?.(payload, action);

          if (!options.graceful) return Promise.reject(payload);
        });
    }
  )
);
