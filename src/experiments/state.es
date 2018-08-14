import updeep from 'updeep';
import { persistExperiments } from './store';

export const types = {
  EXPERIMENT_SET: 'EXPERIMENT_SET',
  EXPERIMENTS_SET: 'EXPERIMENTS_SET',
};

export const actions = {
  setExperiment(name, value) {
    return { type: types.EXPERIMENT_SET, name, value };
  },
  setExperiments(payload) {
    return { type: types.EXPERIMENTS_SET, payload };
  },
};

export const reducer = (state = {}, action) => {
  switch (action.type) {
    case types.EXPERIMENT_SET: {
      const { name, value } = action;
      const isDelete = value === null;

      const nextState = updeep({ [name]: isDelete ? undefined : value }, state);
      if (isDelete) delete nextState[name];

      if (process.browser) persistExperiments(nextState);
      return nextState;
    }
    case types.EXPERIMENTS_SET: {
      if (process.browser) persistExperiments(action.payload);
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
