import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import getField from 'lodash/get';
import { useShallowEqualSelector } from '../utils';
import { setSession } from './actions';


const getSession = ({ session }) => session;

export const useSession = () => useShallowEqualSelector(getSession);

export const useSessionField = (fieldPath, defaultValue = null) => {
  const session = useSession();
  const [value, setValue] = useState(getField(session, fieldPath) ?? defaultValue);

  useEffect(() => {
    setValue(getField(session, fieldPath));
  }, [session]);

  return value;
};

export const useSetSession = () => {
  const dispatch = useDispatch();
  return useCallback((...args) => dispatch(setSession(...args)), []);
};
