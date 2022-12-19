import { useSelector, shallowEqual } from 'react-redux';

export const invoke = (fn: unknown, ...args: unknown[]): unknown => {
  if (typeof fn === 'function') return fn(...args);
};

export const has = (...args: [Record<string, unknown>, PropertyKey]): boolean => (
  Object.prototype.hasOwnProperty.call(...args)
);

export const useShallowEqualSelector = <State>(
  selector: (state: State) => unknown,
) => useSelector(selector, shallowEqual);
