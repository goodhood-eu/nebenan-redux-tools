import Cookies, { CookieAttributes } from 'js-cookie';
import { AnyAction, Reducer } from 'redux';

let keyName: string;
let keyExpires: CookieAttributes['expires'];
let debugEnabled: boolean;

export type ConfigureTokenArguments = {
  name: string;
  expires: CookieAttributes['expires'];
  debug: boolean;
};

export const configureToken = ({ name, expires, debug }: ConfigureTokenArguments): void => {
  keyName = name;
  keyExpires = expires;
  debugEnabled = debug;
};

export const types = {
  TOKEN_SET: 'TOKEN_SET',
};

export const actions = {
  setToken(payload: Record<string, unknown>): AnyAction {
    return { type: types.TOKEN_SET, payload };
  },
};

export const restoreToken = (): string | undefined => Cookies.get(keyName);
export const persistToken = (token: string): void => {
  // Nothing to do here
  if (!token && !Cookies.get(keyName)) return;

  if (token) {
    const options: CookieAttributes = {
      expires: keyExpires,
      secure: !debugEnabled,
      SameSite: 'Lax',
    };

    Cookies.set(keyName, token, options);
  } else {
    Cookies.remove(keyName);
  }
};

export const reducer: Reducer = (state = null, action) => {
  switch (action.type) {
    case types.TOKEN_SET: {
      if (typeof window !== 'undefined') persistToken(action.payload);
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

export { useToken } from './hooks';
