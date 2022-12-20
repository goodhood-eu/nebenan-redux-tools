import * as types from './types';

export type SetSessionReturn = Record<string, unknown> & {
  type: typeof types.SESSION_SET;
};
export const setSession = (payload: unknown): SetSessionReturn => (
  { type: types.SESSION_SET, payload }
);
