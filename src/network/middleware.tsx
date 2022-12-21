import omit from 'lodash/omit';

import { AnyAction, Middleware } from 'redux';
import createRequest from './request';
import { resolved, rejected } from './types';
import { getErrorHandler } from './configuration';

const middleware: Middleware = (store) => (
  (next) => (
    (action) => {
      if (!action.request) return next(action);
      const { request, type } = action;
      const state = store.getState();

      // prevent unnecessary calls
      if (request.shouldRequest && !request.shouldRequest(state)) return Promise.resolve(null);

      const options = omit(request, 'shouldRequest');
      if (!options.token) options.token = state.token;

      const promise = createRequest(options).then(
        (payload) => {
          const meta = { isRequestActive: false, ...action.meta };
          const newAction = { ...omit(action, 'request'), type: resolved(type), meta, payload };
          next(newAction);

          return Promise.resolve(payload);
        },
        (payload) => {
          const meta = { isRequestActive: false, ...action.meta };
          const newAction = { ...omit(action, 'request'), type: rejected(type), meta, payload };
          next(newAction);

          getErrorHandler()?.(payload, options);

          if (!request.graceful) return Promise.reject(payload);
        },
      );

      const nextAction = {
        ...omit(action, 'request'),
        meta: { isRequestActive: true, ...action.meta },
      };
      next(nextAction as unknown as AnyAction);

      return promise;
    }
  )
);

export default middleware;
