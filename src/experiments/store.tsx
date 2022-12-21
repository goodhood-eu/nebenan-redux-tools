import Cookies, { CookieAttributes } from 'js-cookie';
import { stringify, parse } from 'qs';

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

export const parseExperiments = (string: string): Record<string, (string | number)> => {
  const object = parse(string) as Record<string, (string | number)>;
  Object.keys(object).forEach((key) => {
    object[key] = parseInt(object[key] as string, 10);
  });

  return object;
};
export const serializeExperiments = (object: Record<string, unknown>): string => stringify(object);

export const restoreExperiments = (): Record<string, (string | number)> => (
  parseExperiments(Cookies.get(keyName) as string)
);

export const persistExperiments = (object: Record<string, (string | number)>) => {
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
