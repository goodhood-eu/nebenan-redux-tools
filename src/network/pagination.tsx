import defaults from 'lodash/defaults';
import mapValues from 'lodash/mapValues';
import { Reducer } from 'redux';
import { resolved, rejected } from './types';
import { PaginationOptions, RequestQuery } from './index.types';
import { has } from '../utils';

export type ResolvedUpdateObject = null | {
  isFetching?: boolean;
  isFailed?: boolean;
  total?: null | number;
  currentPage?: number;
  collection?: unknown[];
  lastFetched?: number;
};

export const PAGINATION_STEP = 20;

export const PAGINATION_DEFAULTS = {
  per_page: PAGINATION_STEP,
  page: 1,
};

export const getPaginationDefaults = (): ResolvedUpdateObject => ({
  currentPage: 0,
  lastFetched: 0,
  total: null,
  collection: [],
});

/**
 * Provides updates for a given type and state to handle list loading, successful fetch and
 * failed fetch.
 */
export const paginationGenerator = (type: string): Reducer => (
  (state = {}, action) => {
    let update: ResolvedUpdateObject = null;

    if (typeof state.currentPage !== 'number') update = getPaginationDefaults();

    switch (action.type) {
      case type: {
        const currentPage = (state.currentPage || 0) + 1;
        update = { currentPage, isFetching: true, isFailed: false };
        break;
      }
      case resolved(type): {
        update = { isFetching: false, lastFetched: Date.now() };
        if (action.payload && has(action.payload, 'total_count')) {
          update.total = action.payload.total_count;
        }
        break;
      }
      case rejected(type): {
        const currentPage = Math.max((state.currentPage || 0) - 1, 0);
        update = { currentPage, isFetching: false, isFailed: true };
        break;
      }
    }

    return update;
  }
);

/**
 * Same thing as `paginationGenerator` but supports multiple lists.
 */
export const paginationGenerators = (typesByStateKey: Record<string, string>): Reducer => {
  const updaters = mapValues(typesByStateKey, (type) => paginationGenerator(type));

  return (state = {}, action) => (
    Object.keys(updaters).reduce((updates, stateKey) => {
      const update = updaters[stateKey](state[stateKey], action);
      if (!update) return updates;

      return { ...updates, [stateKey]: update };
    }, {})
  );
};

export const assignPaginationDefaults = (
  state: Record<string, unknown>,
): Record<string, unknown> => ({ ...state, ...getPaginationDefaults() });

export const buildPaginationQuery = (
  query: RequestQuery, options: PaginationOptions,
): Record<string, unknown> => {
  if (options && (has(options, 'last') || has(options, 'first'))) {
    const { last, first } = options;

    const pagination: PaginationOptions = {
      per_page: options.per_page || PAGINATION_DEFAULTS.per_page,
    };

    if (last) pagination.lower = last;
    if (first) pagination.higher = first;

    return defaults({}, query, pagination);
  }

  return defaults({}, query, options, PAGINATION_DEFAULTS);
};
