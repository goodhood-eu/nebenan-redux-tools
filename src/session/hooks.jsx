import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useShallowEqualSelector } from 'nebenan-react-hocs/lib/redux_hooks';
import getField from 'lodash/get';
import { setSession } from './actions';


const getSession = ({ session }) => session;

export const useSession = () => useShallowEqualSelector(getSession);

export const useSessionField = (fieldPath, defaultValue = null) => {
  const [value, setValue] = useState(defaultValue);
  const session = useSession();

  useEffect(() => {
    setValue(getField(session, fieldPath));
  }, [session]);

  return value;
};

export const useSetSession = () => {
  const dispatch = useDispatch();
  return useCallback((...args) => dispatch(setSession(...args)), []);
};
