// node-safe local storage
import ls from 'local-storage-adapter';

let keyName: string;
export const configureSession = (name: string) => { keyName = name; };

export const restoreSession = (): Record<string, unknown> => ls.get(keyName);
export const persistSession = (
  payload: Record<string, unknown>,
): boolean => ls.set(keyName, payload);
