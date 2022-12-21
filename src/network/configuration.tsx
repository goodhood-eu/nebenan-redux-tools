import escapeStringRegexp from 'escape-string-regexp-browser';
import { ConfigureNetworkOptions, UnknownCallback } from './index.types';

let baseUrl = '';
let regex: RegExp;

let requestHook: UnknownCallback;
let responseHook: UnknownCallback;

let locale: string;
let onError: UnknownCallback;

export const configureNetwork = (options: ConfigureNetworkOptions = {}): void => {
  baseUrl = options.baseUrl as string;
  regex = new RegExp(`^https:\\/\\/(?:[\\w-]+\\.)?${escapeStringRegexp(options.trustedDomain as string)}`);
  requestHook = options.requestHook;
  responseHook = options.responseHook;
  onError = options.onError;
  locale = options.locale as string;
};

export const getBaseUrl = (): string => baseUrl;
export const getTrustedDomainRegex = (): RegExp => regex;
export const getGlobalHooks = (): {
  requestHook: UnknownCallback,
  responseHook: UnknownCallback
} => ({ requestHook, responseHook });
export const getLocaleHeader = (): string => locale;
export const getErrorHandler = (): UnknownCallback => onError;
