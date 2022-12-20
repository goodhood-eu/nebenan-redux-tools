export type OnErrorCallback = (...args: unknown[]) => unknown;

export type ConfigurePromiseOptions = Record<string, unknown> & {
  onError?: OnErrorCallback;
};

let onError: OnErrorCallback | undefined;

export const configurePromise = (options: ConfigurePromiseOptions = {}) => {
  onError = options.onError as OnErrorCallback;
};

export const getErrorHandler = () => onError;
