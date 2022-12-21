import { RESOLVED, REJECTED } from '../promise';

export const resolved = (type: string): string => `${type}_${RESOLVED}`;
export const rejected = (type: string): string => `${type}_${REJECTED}`;
