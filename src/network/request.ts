import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { stringify } from 'qs';

import { buildPaginationQuery } from './pagination';
import { getBaseUrl, getGlobalHooks, getLocaleHeader, getTrustedDomainRegex } from './configuration';
import { STATUS_CODE_NO_RESPONSE, STATUS_CODE_REQUEST_FAILED } from './constants';
import { invoke } from '../utils';
import {
  NetworkError,
  PaginationOptions,
  RequestConfig,
  RequestOptions,
  RequestQuery,
  RequestResponse,
  RequestType,
} from './index.types';

const EXTERNAL_URL_PREFIX = /^https?:\/\//;

export const isExternalUrl = (url: string): boolean => EXTERNAL_URL_PREFIX.test(url);
export const isTrustworthyUrl = (url: string): boolean => {
  const regex = getTrustedDomainRegex();
  return regex && regex.test(url);
};

const paramsSerializer = (
  params: Record<string, unknown>,
): string => stringify(params, { indices: false });

export type NetworkErrorResponseObject = {
  data: Record<string, unknown>;
  status: string;
};
export type GetNetworkErrorArguments = {
  response: NetworkErrorResponseObject,
  request: RequestType,
  message: string,
};
const getNetworkError = (
  { response, request, message }: GetNetworkErrorArguments,
): NetworkError => {
  if (response) {
    return {
      ...response.data,
      statusCode: response.status ? parseInt(response.status, 10) : 500,
    };
  }

  if (request) {
    return {
      data: request,
      message: 'No response from server',
      statusCode: STATUS_CODE_NO_RESPONSE,
    };
  }

  return {
    data: message,
    message: 'Error while creating request',
    statusCode: STATUS_CODE_REQUEST_FAILED,
  };
};

const getRequestConfig = <P>(options: RequestOptions<P> = {}): RequestConfig => {
  const isExternal = isExternalUrl(options.url as string);
  const isTrustworthy = isTrustworthyUrl(options.url as string);
  const locale = options.locale || getLocaleHeader();

  let url = options.url as string;
  if (!isExternal) url = `${getBaseUrl()}${url}`;

  const config: RequestConfig = {
    url,
    paramsSerializer,
    headers: { Accept: 'application/json' },
  };

  if (options.type) config.method = options.type;
  if (options.query) config.params = options.query;
  if (options.payload) config.data = options.payload;

  if (options.signal) {
    config.signal = options.signal;
  } else if (options.getAbortCallback) { // TODO: deprecate getAbortCallback in next major release
    const controller = new AbortController();

    options.getAbortCallback(() => {
      controller.abort();
    });

    config.signal = controller.signal;
  }

  if (options.type === 'query') {
    config.method = 'get';
    config.params = buildPaginationQuery(
      (options.query as RequestQuery), (options.pagination as PaginationOptions),
    );
  }

  if (!isExternal || isTrustworthy) {
    if (options.token) config.headers['X-AUTH-TOKEN'] = options.token;
    if (locale) config.headers['X-Translations-Lang'] = locale;
  }

  if ((options.type === 'post' || options.type === 'put') && !options.multipart) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
};

export default <T extends Record<string, unknown>, P>(
  options: RequestOptions<P>,
): Promise<RequestResponse<T>> => {
  const { requestHook, responseHook } = getGlobalHooks();
  const requestConfig = getRequestConfig(options);

  // These methods will mutate config object.
  invoke(options.customize, requestConfig, options);
  invoke(requestHook, requestConfig, options);

  const pipeResponse = (response: AxiosResponse<T>) => {
    const body = (response && response.data) ? response.data : {};
    invoke(responseHook, body, requestConfig, options);
    return body;
  };

  const rethrowError = (error: GetNetworkErrorArguments) => {
    const networkError = getNetworkError(error);

    invoke(responseHook, networkError, requestConfig, options);
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw networkError;
  };

  return axios(requestConfig as AxiosRequestConfig)
    .then(pipeResponse, rethrowError) as Promise<RequestResponse<T>>;
};
