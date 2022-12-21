import updeep from 'updeep';
import { assert } from 'chai';
import { Reducer } from 'redux';
import { PaginationOptions } from './index.types';
import {
  resolved,
  rejected,
} from './types';
import {
  PAGINATION_STEP,
  assignPaginationDefaults,
  paginationGenerator,
  paginationGenerators,
  buildPaginationQuery,
} from './pagination';


describe('network/pagination', () => {
  it('assignPaginationDefaults', () => {
    const state = {
      a: 1,
      b: 2,
      currentPage: 12,
      lastFetched: 13213123213,
      total: 22,
      collection: [],
    };

    const updated = assignPaginationDefaults(state);

    assert.notStrictEqual(state, updated, 'Mutated state object');
    assert.equal(updated.a, 1, 'Old state is in place');
    assert.equal(updated.currentPage, 0, 'Cleared currentPage');
    assert.equal(updated.lastFetched, 0, 'Cleared lastFetched');
    assert.equal(updated.total, null, 'Cleared total');
    assert.deepEqual(updated.collection, [], 'Cleared collection');
  });

  describe('paginationGenerator', () => {
    const TEST_ACTION = 'TEST_ACTION';

    const defaultState = { a: 1 };
    let state: Record<string, unknown>;

    const resolvedPayload = { total_count: 123 };
    const rejectedPayload = { error: 'Cryptic error message' };

    let pagination: Reducer;

    beforeEach(() => {
      pagination = paginationGenerator(TEST_ACTION);
      state = updeep(pagination(defaultState, { type: 'a' }), defaultState);
    });

    it('correct format', () => assert.isFunction(pagination, 'not a function'));

    it('request initiation handling', () => {
      const update = pagination(state, { type: TEST_ACTION });
      state = updeep(update, state);

      assert.equal(state.currentPage, 1, 'Empty set currentPage starting from 1');
      assert.equal(state.lastFetched, 0, 'Empty set lastFetched starting from 0');
      assert.equal(state.total, null, 'Empty set total starting from null');
      assert.isTrue(state.isFetching, 'Fetching set');
      assert.isFalse(state.isFailed, 'isFailed reset');
    });

    it('request resolve handling', () => {
      let update = pagination(state, { type: TEST_ACTION });
      state = updeep(update, state);

      update = pagination(state, { type: resolved(TEST_ACTION), payload: resolvedPayload });
      state = updeep(update, state);

      assert.equal(state.currentPage, 1, 'currentPage is still 1');
      assert.approximately((state.lastFetched as number), Date.now(), 10, 'lastFetched set');
      assert.equal(state.total, 123, 'total set');
      assert.isFalse(state.isFetching, 'Fetching set');
      assert.isFalse(state.isFailed, 'isFailed reset');
    });

    it('request reject handling', () => {
      let update = pagination(state, { type: TEST_ACTION });
      state = updeep(update, state);

      update = pagination(state, { type: rejected(TEST_ACTION), payload: rejectedPayload });
      state = updeep(update, state);

      assert.equal(state.currentPage, 0, 'currentPage changed to 0');
      assert.equal(state.lastFetched, 0, 'lastFetched kept previous value');
      assert.equal(state.total, null, 'total kept previous value');
      assert.isFalse(state.isFetching, 'Fetching set');
      assert.isTrue(state.isFailed, 'isFailed set');
    });
  });

  describe('paginationGenerators', () => {
    it('collects updates for multiple generators in one update', () => {
      const actions = {
        FETCH_MAIN_LIST: 'FETCH_LIST',
        FETCH_CUSTOM_LIST: 'FETCH_CUSTOM_LIST',
      };

      const pagination = paginationGenerators({
        mainList: actions.FETCH_MAIN_LIST,
        customList: actions.FETCH_CUSTOM_LIST,
      });

      assert.deepEqual(
        pagination(
          {
            mainList: {},
            customList: {},
          },
          { type: 'UNKOWN_ACTION', payload: { } },
        ),
        {
          mainList: {
            collection: [],
            currentPage: 0,
            lastFetched: 0,
            total: null,
          },

          customList: {
            collection: [],
            currentPage: 0,
            lastFetched: 0,
            total: null,
          },
        },
        'returns initialization updates for all lists',
      );

      assert.deepEqual(
        pagination(
          {
            mainList: {
              collection: [],
              currentPage: 0,
              lastFetched: 0,
              total: null,
            },

            customList: {
              collection: [],
              currentPage: 0,
              lastFetched: 0,
              total: null,
            },
          },
          { type: rejected(actions.FETCH_MAIN_LIST), payload: { total_count: 123 } },
        ),
        {
          mainList: { isFetching: false, currentPage: 0, isFailed: true },
        },
        'returns update for mainList',
      );
    });
  });

  it('buildPaginationQuery', () => {
    const options = {
      page: 35,
    };
    const expected = {
      page: 35,
      per_page: PAGINATION_STEP,
    };

    const options2 = {
      last: 123,
    };
    const expected2 = {
      lower: 123,
      per_page: PAGINATION_STEP,
    };

    const options3 = {
      first: 123,
    };
    const expected3 = {
      higher: 123,
      per_page: PAGINATION_STEP,
    };

    const query4 = {
      custom: 'custom',
    };
    const options4 = {
      first: 123,
    };
    const expected4 = {
      higher: 123,
      per_page: PAGINATION_STEP,
      custom: 'custom',
    };

    assert.deepEqual(buildPaginationQuery({}, options as PaginationOptions), expected, 'defaults');
    assert.deepEqual(buildPaginationQuery({}, options2), expected2, 'defaults');
    assert.deepEqual(buildPaginationQuery({}, options3), expected3, 'defaults');
    assert.deepEqual(buildPaginationQuery(query4, options4), expected4, 'defaults');
  });
});
