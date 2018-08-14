import omit from 'lodash/omit';

import createApi from './api';
import createRequest from './request';
import { resolved, rejected } from './types';


export default (store) => (
  (next) => (
    (action) => {
      if (!action.request) return next(action);
      const { request, type } = action;
      const state = store.getState();

      // raw network call
      let promise;
      let result;
      if (typeof request === 'function') {
        result = request(createApi(state.token), store.dispatch, state);

        if (!result || !result.request || !result.promise) {
          throw new Error('request function must return a hash with `request` and `promise` props');
        }

        promise = result.promise;
      } else {
        // prevent unnecessary calls
        if (request.shouldRequest && !request.shouldRequest(state)) return Promise.resolve(null);
        const options = omit(request, 'shouldRequest');
        if (!options.token) options.token = state.token;

        result = createRequest(options).promise;
        promise = result;
      }

      promise
        .then((payload) => {
          const meta = { isNetworkActive: false, ...action.meta };
          const newAction = { ...omit(action, 'request'), type: resolved(type), meta, payload };
          next(newAction);
        })
        .catch((payload) => {
          const meta = { isNetworkActive: false, ...action.meta };
          const newAction = { ...omit(action, 'request'), type: rejected(type), meta, payload };
          next(newAction);
        });

      const nextAction = {
        ...omit(action, 'request'),
        meta: { isNetworkActive: true, ...action.meta },
      };
      next(nextAction);
      return result;
    }
  )
);
