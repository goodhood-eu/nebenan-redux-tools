import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getField from 'lodash/get';
import { setSession } from './actions';


const getSession = (state) => state.session;

export const useSessionField = (key, defaultValue = null) => {
  const [value, setValue] = useState(defaultValue);
  const session = useSelector(getSession);

  useEffect(() => {
    setValue(getField(session, key));
  }, [session]);

  return value;
};

export const useSetSession = () => {
  const dispatch = useDispatch();
  return useCallback((...args) => dispatch(setSession(...args)), []);
};
