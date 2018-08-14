import createRequest from './request';

const SUPPORTED_TYPES = ['get', 'post', 'put', 'delete', 'query'];

export default (token) => (
  SUPPORTED_TYPES.reduce((acc, type) => {
    acc[type] = (options = {}) => {
      options.type = type;
      if (!options.token && token) options.token = token;
      return createRequest(options);
    };
    return acc;
  }, {})
);
