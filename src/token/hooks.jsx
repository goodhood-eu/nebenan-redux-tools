import { useSelector } from 'react-redux';

const selectToken = ({ token }) => token;
export const useToken = () => useSelector(selectToken);
