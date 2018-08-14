import { assert } from 'chai';

import {
  isExpired,
  isFetchable,
} from '../../../client/modules/network/utils';


describe('modules/network/utils', () => {
  it('isExpired', () => {
    const state = { lastFetched: Date.now() - 1000 };

    assert.isTrue(isExpired(state, 999), 'Expires correctly');
    assert.isFalse(isExpired(state, 1001), 'Not expired values are falsy');
  });

  it('isFetchable', () => {
    const defaultState = { total: null, collection: [] };

    const emptyState = { total: 0, collection: [] };
    const incompleteState = { total: 5, collection: [1, 2] };

    const completeStateA = { total: 2, collection: [1, 2] };
    const completeStateB = { total: 7, collection: [1, 2, 3, 4, 5] };

    const completeFullStateA = { total: 5, collection: [1, 2, 3, 4, 5] };
    const completeFullStateB = { total: 7, collection: [1, 2, 3, 4, 5, 6, 7] };

    assert.isTrue(isFetchable(defaultState, 5), 'default state');

    assert.isTrue(isFetchable(incompleteState, 5), 'size is smaller and can be fetched');
    assert.isFalse(isFetchable(emptyState, 5), 'empty list');

    assert.isFalse(isFetchable(completeStateA, 5), 'size is smaller but all items are fetched');
    assert.isFalse(isFetchable(completeStateB, 5), 'size is larger and not all items are fetched');

    assert.isFalse(isFetchable(completeFullStateA, 5), 'size is exact');
    assert.isFalse(isFetchable(completeFullStateB, 5), 'size is larger');
  });
});
