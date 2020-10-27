// node-safe local storage
import ls from 'local-storage-adapter';

let keyName;
export const configureSession = (name) => { keyName = name; };

export const restoreSession = () => ls.get(keyName);
export const persistSession = (payload) => ls.set(keyName, payload);
