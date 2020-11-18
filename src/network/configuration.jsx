import escapeStringRegexp from 'escape-string-regexp-browser';

let baseUrl = '';
let regex;

let requestHook;
let responseHook;

let locale;

export const configureNetwork = (options = {}) => {
  baseUrl = options.baseUrl;
  regex = new RegExp(`^https:\\/\\/(?:[\\w-]+\\.)?${escapeStringRegexp(options.trustedDomain)}`);
  requestHook = options.requestHook;
  responseHook = options.responseHook;
  locale = options.locale;
};

export const getBaseUrl = () => baseUrl;
export const getTrustedDomainRegex = () => regex;
export const getGlobalHooks = () => ({ requestHook, responseHook });
export const getLocaleHeader = () => locale;
