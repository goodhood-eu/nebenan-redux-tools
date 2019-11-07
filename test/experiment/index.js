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
  it('updateExperiments', () => {
    const current = {
      a: 42,
      rocket: 69,
    };

    const updated = updateExperiments(current, configHash);
    const custom = updateExperiments(current, null, configHash);

    assert.isObject(updateExperiments({}), 'returns object');
    assert.equal(updated.a, current.a, 'doesn\'t change existing');
    assert.isBelow(updated.b, configHash.b, 'sets correct value');
    assert.isBelow(updated.c, configHash.c, 'sets correct value');

    assert.isObject(updateExperiments({}, null, {}), 'returns object');
    assert.equal(custom.a, current.a, 'doesn\'t change existing with custom props');
  });
});
