import escapeStringRegexp from 'escape-string-regexp';

let api = '';
let regex;

export const configureNetwork = (options) => {
  api = options.api;
  regex = new RegExp(`^https:\\/\\/(?:[\\w-]+\\.)?${escapeStringRegexp(options.trustedDomain)}`);
};

export const getApiRoot = () => api;
export const getTrustedDomainRegex = () => regex;
