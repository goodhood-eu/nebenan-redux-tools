import updeep from 'updeep';
import { Reducer } from 'redux';
import { persistExperiments } from './store';

export const types = {
  EXPERIMENT_SET: 'EXPERIMENT_SET',
  EXPERIMENTS_SET: 'EXPERIMENTS_SET',
};

export const actions = {
  setExperiment(name: string, value: string) {
    return { type: types.EXPERIMENT_SET, name, value };
  },
  setExperiments(payload: Record<string, string>) {
    return { type: types.EXPERIMENTS_SET, payload };
  },
};

// eslint-disable-next-line @typescript-eslint/default-param-last
export const reducer: Reducer = (state = {}, action) => {
  switch (action.type) {
    case types.EXPERIMENT_SET: {
      const { name, value } = action;
      const isDelete = value === null;

      const nextState = updeep({ [name]: isDelete ? undefined : value }, state);
      if (isDelete) delete nextState[name];

      if (typeof window !== 'undefined') persistExperiments(nextState);
      return nextState;
    }
    case types.EXPERIMENTS_SET: {
      if (typeof window !== 'undefined') persistExperiments(action.payload);
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
