let onError;

export const configurePromise = (options = {}) => {
  onError = options.onError;
};

export const getErrorHandler = () => onError;
