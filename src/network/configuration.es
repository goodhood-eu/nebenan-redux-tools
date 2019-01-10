import escapeStringRegexp from 'escape-string-regexp';

let baseUrl = '';
let regex;

let requestHook;
let responseHook;

export const configureNetwork = (options = {}) => {
  baseUrl = options.baseUrl;
  regex = new RegExp(`^https:\\/\\/(?:[\\w-]+\\.)?${escapeStringRegexp(options.trustedDomain)}`);
  requestHook = options.requestHook;
  responseHook = options.responseHook;
};

export const getBaseUrl = () => baseUrl;
export const getTrustedDomainRegex = () => regex;
export const getGlobalHooks = () => ({ requestHook, responseHook });
