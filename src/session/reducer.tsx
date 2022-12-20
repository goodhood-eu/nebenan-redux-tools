import updeep from 'updeep';
import { Reducer } from 'redux';
import * as types from './types';
import { persistSession } from './utils';

const reducer: Reducer = (state = {}, action) => {
  switch (action.type) {
    case types.SESSION_SET: {
      if (action.payload === null) return {};

      const nextState = updeep(action.payload, state);
      persistSession(nextState);
      return nextState;
    }
    default: {
      return state;
    }
  }
};

export default reducer;
