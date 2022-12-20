import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import getField from 'lodash/get';
import { setSession } from './actions';
import { useShallowEqualSelector } from '../utils';


const getSession = (
  { session }: { session: Record<string, unknown> },
): Record<string, unknown> => session;

export const useSession = () => useShallowEqualSelector(getSession);

export const useSessionField = (fieldPath: string, defaultValue = null): string | null => {
  const session = useSession();
  const [value, setValue] = useState<string | null>(getField(session, fieldPath) ?? defaultValue);

  useEffect(() => {
    setValue(getField(session, fieldPath));
  }, [session]);

  return value;
};

export const useSetSession = () => {
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return useCallback((...args: unknown[]) => dispatch(setSession(...args)), []);
};
