import { assert } from 'chai';
import sinon from 'sinon';
import {
  invoke,
  has,
} from './index';


describe('utils', () => {
  it('invoke', () => {
    const func = (_first: unknown, second: unknown) => second;
    const spy = sinon.spy();
    invoke(spy);
    assert.isTrue(spy.calledOnce, 'called');
    assert.equal(invoke(func, 'a', 'b'), 'b', 'passes down args properly');
  });

  it('has', () => {
    const Klass = function (this: any) { this.a = true; };
    Klass.prototype.c = true;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const test = new Klass();

    assert.isFalse(has({}, 'a'), 'empty object');
    assert.isTrue(has({ b: undefined }, 'b'), 'own undefined prop');
    assert.isTrue(has(test, 'a'), 'own prop');
    assert.isFalse(has(test, 'c'), 'prototype');
  });
});
