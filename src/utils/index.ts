import { useSelector, shallowEqual } from 'react-redux';
import { UnknownCallback } from '../network/index.types';

export const invoke = (fn: UnknownCallback, ...args: unknown[]): unknown => {
  if (typeof fn === 'function') return fn(...args);
};

export const has = (...args: [Record<string, unknown>, PropertyKey]): boolean => (
  Object.prototype.hasOwnProperty.call(...args)
);

export const useShallowEqualSelector = <State>(
  selector: (state: State) => unknown,
) => useSelector(selector, shallowEqual);
