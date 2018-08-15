const { assert } = require('chai');

const {
  parseExperiments,
} = require('../../lib/experiments/store');

describe('experiments/store', () => {
  it('parseExperiments', () => {
    const string = 'a=1&b=2';

    const expected = {
      a: 1,
      b: 2,
    };

    assert.isObject(parseExperiments(), 'returns object');
    assert.deepEqual(parseExperiments(string), expected, 'parsed correctly');
  });
});
