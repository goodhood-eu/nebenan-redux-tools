import updeep from 'updeep';
import { persistExperiments } from './store';
import { Experiments, ExperimentValue, State } from './types';

type SetExperimentAction = {
  type: 'EXPERIMENT_SET',
  name: string,
  value: ExperimentValue | null,
};
type SetExperimentsAction = {
  type: 'EXPERIMENTS_SET',
  payload: Experiments,
};

export const actions = {
  setExperiment(
    name: SetExperimentAction['name'],
    value: SetExperimentAction['value'],
  ): SetExperimentAction {
    return { type: 'EXPERIMENT_SET', name, value };
  },
  setExperiments(payload: SetExperimentsAction['payload']): SetExperimentsAction {
    return { type: 'EXPERIMENTS_SET', payload };
  },
} as const;

type Action = SetExperimentAction | SetExperimentsAction;

export const reducer = (state : State = {}, action: Action) => {
  switch (action.type) {
    case 'EXPERIMENT_SET': {
      const { name, value } = action;
      const isDelete = value === null;

      const nextState = updeep({ [name]: isDelete ? updeep.omitted : value }, state) as State;

      if (typeof window !== 'undefined') persistExperiments(nextState);
      return nextState;
    }
    case 'EXPERIMENTS_SET': {
      if (typeof window !== 'undefined') persistExperiments(action.payload);
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
