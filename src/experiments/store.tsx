import Cookies, { CookieAttributes } from 'js-cookie';
import { stringify, parse } from 'qs';
import { Experiments } from './types';

let keyName: string;
let keyExpires: CookieAttributes['expires'];
let debugEnabled: boolean;

type ConfigureExperimentsArgs = {
  name: string;
  expires: CookieAttributes['expires'];
  debug: boolean;
};
export const configureExperiments = ({ name, expires, debug }: ConfigureExperimentsArgs): void => {
  keyName = name;
  keyExpires = expires;
  debugEnabled = debug;
};

export const parseExperiments = (serialized: string): Experiments => {
  const object = parse(serialized) as Experiments;
  Object.keys(object).forEach((key) => {
    object[key] = parseInt(object[key] as string, 10);
  });

  return object;
};
export const serializeExperiments = (object: Experiments): string => stringify(object);

export const restoreExperiments = (): Experiments => (
  parseExperiments(Cookies.get(keyName) as string)
);

export const persistExperiments = (object: Experiments) => {
  const value = serializeExperiments(object);

  // Nothing to do here
  if (!value && !Cookies.get(keyName)) return;

  if (value) {
    const options: CookieAttributes = {
      expires: keyExpires,
      secure: !debugEnabled,
      SameSite: 'Lax',
    };

    Cookies.set(keyName, value, options);
  } else {
    Cookies.remove(keyName);
  }
};
