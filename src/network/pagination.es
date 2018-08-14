import defaults from 'lodash/defaults';
import { has } from 'nebenan-helpers/lib/data';
import { resolved, rejected } from './types';

export const PAGINATION_STEP = 20;

export const PAGINATION_DEFAULTS = {
  per_page: PAGINATION_STEP,
  page: 1,
};

export const getPaginationDefaults = () => ({
  currentPage: 0,
  lastFetched: 0,
  total: null,
  collection: [],
});

export const paginationGenerator = (type) => (
  (state = {}, action) => {
    let update = null;

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

export const assignPaginationDefaults = (state) => ({ ...state, ...getPaginationDefaults() });

export const buildPaginationQuery = (query, options) => {
  if (options && (has(options, 'last') || has(options, 'first'))) {
    const { last, first } = options;

    const pagination = {
      per_page: options.per_page || PAGINATION_DEFAULTS.per_page,
    };

    if (last) pagination.lower = last;
    if (first) pagination.higher = first;

    return defaults({}, query, pagination);
  }

  return defaults({}, query, options, PAGINATION_DEFAULTS);
};
