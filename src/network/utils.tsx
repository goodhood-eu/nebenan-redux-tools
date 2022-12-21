import { NetworkError } from './index.types';

export const DEFAULT_CACHING_TIME = 1000 * 60 * 2;

export type IsExpiredStateArgument = Record<string, unknown> & {
  lastFetched: number;
};
export type IsFetchableStateArgument = Record<string, unknown> & {
  total?: (string | number);
  collection: unknown[];
};

export const isExpired = (
  state: IsExpiredStateArgument, time = DEFAULT_CACHING_TIME,
): boolean => (
  Date.now() - (state.lastFetched as number) > time
);

export const isFetchable = (state: IsFetchableStateArgument, size: number): boolean => {
  if (typeof state.total !== 'number') return true;
  return state.total >= size && state.collection.length < size;
};

export const getTotalCount = (collection?: unknown[], result?: unknown[]): number => {
  if (!collection || !Array.isArray(collection)) return 0;
  const resultLength = result ? result.length : 0;
  return collection.length + (resultLength * 2);
};

export const isNetworkError = (error?: NetworkError): boolean => error?.statusCode !== undefined;
