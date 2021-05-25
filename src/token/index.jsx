import Cookies from 'js-cookie';

let keyName;
let keyExpires;
let debugEnabled;

export const configureToken = ({ name, expires, debug }) => {
  keyName = name;
  keyExpires = expires;
  debugEnabled = debug;
};

export const types = {
  TOKEN_SET: 'TOKEN_SET',
};

export const actions = {
  setToken(payload) {
    return { type: types.TOKEN_SET, payload };
  },
};

export const restoreToken = () => Cookies.get(keyName);
export const persistToken = (token) => {
  // Nothing to do here
  if (!token && !Cookies.get(keyName)) return;

  if (token) {
    const options = {
      expires: keyExpires,
      secure: !debugEnabled,
      SameSite: 'Lax',
    };

    Cookies.set(keyName, token, options);
  } else {
    Cookies.remove(keyName);
  }
};

export const reducer = (state = null, action) => {
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
