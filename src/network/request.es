import superagent from 'superagent';
import { invoke } from '../utils';

import { buildPaginationQuery } from './pagination';
import { getApiRoot, getTrustedDomainRegex } from './configuration';

const EXTERNAL_URL_PREFIX = /^https?:\/\//;

export const isExternalUrl = (url) => EXTERNAL_URL_PREFIX.test(url);
export const isTrustworthyUrl = (url) => {
  const regex = getTrustedDomainRegex();
  return regex && regex.test(url);
};

export default (options = {}) => {
  if (!options.type) options.type = 'get';

  if (options.type === 'query') {
    options.type = 'get';
    options.query = buildPaginationQuery(options.query, options.pagination);
  }

  const isExternal = isExternalUrl(options.url);
  const isTrustworthy = isTrustworthyUrl(options.url);

  let url = options.url;
  if (!isExternal) url = `${getApiRoot()}${url}`;

  const request = superagent(options.type, url);

  if (options.token && (!isExternal || isTrustworthy)) request.set({ 'X-AUTH-TOKEN': options.token });
  request.set({ Accept: 'application/json' });

  if ((options.type === 'post' || options.type === 'put') && !options.multipart) {
    request.set('Content-Type', 'application/json');
  }

  if (options.query) request.query(options.query);
  if (options.payload) request.send(options.payload);
  invoke(options.customize, request);

  const executor = (resolve, reject) => {
    request.end((originalError, originalResponse) => {
      let error = originalError;
      let response = originalResponse;
      if (options.interceptor) {
        const intercepted = options.interceptor({ error, response });
        error = intercepted.error;
        response = intercepted.response;
      }

      const body = (response && response.body) ? response.body : {};

      if (error) {
        body.statusCode = response && response.status ? parseInt(response.status, 10) : 500;
        reject(body);
      } else {
        resolve(body);
      }
    });
  };

  const promise = new Promise(executor);

  return { request, promise };
};
