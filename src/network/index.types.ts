import { Method } from 'axios';

export type SuccessResponse<T> = T & Record<string, unknown>;

export type UnknownCallback = ((...args: unknown[]) => unknown) | (() => unknown) | undefined;

export type NetworkError = {
  statusCode: number;
} & (
  | {
    data?: RequestType | string;
    message?: string;
  }
);

export type RequestResponse<T = Record<string, unknown>> = NetworkError | SuccessResponse<T>;

export type RequestType =
  | 'query'
  | Method;

export type RequestQuery = Record<string, unknown>;
export type AbortCallback = (callback: () => void) => void;

export type HasLast = { last?: unknown };
export type HasFirst = { first?: unknown };

export type PaginationOptions = {
  per_page?: number;
  lower?: PaginationOptions['last'];
  higher?: PaginationOptions['first'];
  last?: unknown;
  first?: unknown;
};

export type RequestOptions<P = Record<string, unknown>> = {
  url?: string,
  locale?: string,
  type?: RequestType,
  query?: RequestQuery,
  payload?: P,
  signal?: AbortSignal,
  getAbortCallback?: AbortCallback,
  pagination?: PaginationOptions,
  graceful?: boolean,
  token?: string,
  multipart?: boolean,
  customize?: UnknownCallback;
};

export type ConfigureNetworkOptions = {
  baseUrl?: string;
  regex?: RegExp;
  requestHook?: UnknownCallback;
  responseHook?: UnknownCallback;
  onError?: UnknownCallback;
  locale?: string;
  trustedDomain?: string;
  signal?: AbortSignal
};

export type RequestConfig = {
  url: string;
  method?: RequestType;
  signal?: AbortSignal;
  params?: RequestQuery;
  data?: Record<string, unknown>;
  headers: Record<string, unknown>;
  paramsSerializer: (data: Record<string, unknown>) => string;
};
