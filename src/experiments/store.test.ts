import { assert } from 'chai';
import { parseExperiments } from './store';

describe('experiments/store', () => {
  it('parseExperiments', () => {
    const string = 'a=1&b=2';

    const expected = {
      a: 1,
      b: 2,
    };

    assert.deepEqual(parseExperiments(string), expected, 'parsed correctly');
  });
});
