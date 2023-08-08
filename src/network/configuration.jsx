import escapeStringRegexp from 'escape-string-regexp-browser';

let baseUrl = '';
let regex;

let requestHook;
let responseHook;

let locale;
let onError;

export const configureNetwork = (options = {}) => {
  baseUrl = options.baseUrl;
  regex = new RegExp(`^https:\\/\\/(?:[\\w-]+\\.)?${escapeStringRegexp(options.trustedDomain)}`);
  requestHook = options.requestHook;
  responseHook = options.responseHook;
  onError = options.onError;
  locale = options.locale;
};

export const getBaseUrl = () => baseUrl;
export const getTrustedDomainRegex = () => regex;
export const getLocaleHeader = () => locale;
export const getErrorHandler = () => onError;
export const getRequestHook = () => requestHook;
export const getResponseHook = () => responseHook;
