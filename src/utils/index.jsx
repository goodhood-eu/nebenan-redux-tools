export const invoke = (fn, ...args) => {
  if (typeof fn === 'function') return fn(...args);
};

export const has = (...args) => Object.prototype.hasOwnProperty.call(...args);
