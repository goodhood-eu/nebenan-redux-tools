const { assert } = require('chai');

const {
  updateExperiments,
} = require('../../lib/experiments');

const configHash = {
  a: 1,
  b: 2,
  c: 99,
};

describe('experiments', () => {
  it('createExperiments', () => {
    const current = {
      a: 42,
      rocket: 69,
    };

    const updated = updateExperiments(current, configHash);

    assert.isObject(updateExperiments({}), 'returns object');
    assert.equal(updated.a, current.a, 'doesn\'t change existing');
    assert.isBelow(updated.b, configHash.b, 'sets correct value');
    assert.isBelow(updated.c, configHash.c, 'sets correct value');
  });
});
