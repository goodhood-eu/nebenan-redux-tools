import { useSelector } from 'react-redux';

const selectToken = ({ token }: { token: string }): string => token;
export const useToken = () => useSelector(selectToken);
