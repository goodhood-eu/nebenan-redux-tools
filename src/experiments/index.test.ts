import { assert } from 'chai';
import { updateExperiments } from './index';

describe('experiments', () => {
  describe('updateExperiments', () => {
    it('returns object on empty call', () => {
      assert.isObject(updateExperiments({}));
    });

    context('with random experiments', () => {
      it('keeps original setting', () => {
        assert.deepEqual(
          updateExperiments(
            { donations: 1 },
            { donations: 5 },
          ),
          { donations: 1 },
        );
      });

      it('sets new variation if not yet set', () => {
        const updated = updateExperiments(
          { },
          { travel_fun: 2 },
        );

        assert.isBelow((updated.travel_fun as number), 2);
      });
    });

    context('with other experiments', () => {
      it('keeps original setting', () => {
        assert.deepEqual(
          updateExperiments(
            { donations: 1 },
            undefined,
            { donations: 5 },
          ),
          { donations: 1 },
        );
      });

      it('sets given variation if not yet set', () => {
        assert.deepEqual(
          updateExperiments(
            { },
            undefined,
            { donations: 5 },
          ),
          { donations: 5 },
        );
      });
    });

    context('with overrides', () => {
      it('overwrites everything previously set', () => {
        assert.deepEqual(
          updateExperiments(
            { donations: 2 },
            { donations: 3 },
            { donations: 5 },
            { donations: 69 },
          ),
          { donations: 69 },
        );
      });
    });
  });
});
