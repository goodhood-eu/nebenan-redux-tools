import Cookies from 'js-cookie';
import { stringify, parse } from 'querystring';

let keyName;
let keyExpires;
let debugEnabled;

export const configureExperiments = ({ name, expires, debug }) => {
  keyName = name;
  keyExpires = expires;
  debugEnabled = debug;
};

export const parseExperiments = (string) => {
  const object = parse(string);
  Object.keys(object).forEach((key) => { object[key] = parseInt(object[key], 10); });
  return object;
};
export const serializeExperiments = (object) => stringify(object);

export const restoreExperiments = () => parseExperiments(Cookies.get(keyName));
export const persistExperiments = (object) => {
  const value = serializeExperiments(object);

  // Nothing to do here
  if (!value && !Cookies.get(keyName)) return;

  if (value) {
    const options = {
      expires: keyExpires,
      secure: !debugEnabled,
      SameSite: 'Lax',
    };

    Cookies.set(keyName, value, options);
  } else {
    Cookies.remove(keyName);
  }
};
