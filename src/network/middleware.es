import omit from 'lodash/omit';

import createRequest from './request';
import { resolved, rejected } from './types';


export default (store) => (
  (next) => (
    (action) => {
      if (!action.request) return next(action);
      const { request, type } = action;
      const state = store.getState();

      // prevent unnecessary calls
      if (request.shouldRequest && !request.shouldRequest(state)) return Promise.resolve(null);

      const options = omit(request, 'shouldRequest');
      if (!options.token) options.token = state.token;

      const promise = createRequest(options);

      promise
        .then((payload) => {
          const meta = { isRequestActive: false, ...action.meta };
          const newAction = { ...omit(action, 'request'), type: resolved(type), meta, payload };
          next(newAction);
        })
        .catch((payload) => {
          const meta = { isRequestActive: false, ...action.meta };
          const newAction = { ...omit(action, 'request'), type: rejected(type), meta, payload };
          next(newAction);
        });

      const nextAction = {
        ...omit(action, 'request'),
        meta: { isRequestActive: true, ...action.meta },
      };
      next(nextAction);

      return promise;
    }
  )
);
