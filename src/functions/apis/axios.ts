import axios from 'axios';
import Router from 'next/router';
import { paths } from '@/constants/paths';
import { useWebUtilStore } from '@/store/webUtil';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ROOT_URL,
});


axiosInstance.interceptors.response.use(
  (response) => response,
  (err) => {
    const { setSnackBar } = useWebUtilStore.getState();

    if (
      err.response?.data.statusCode !== 404 &&
      err.response?.data.statusCode !== 400 &&
      err.response?.data.statusCode !== 500
    ) {
      setSnackBar({
        message: err.response?.data.translate || err.response?.data.message,
        icon: 'error',
      });
    }

    if (err.response?.data.statusCode === 403) {
      localStorage.removeItem('session');
      delete axiosInstance.defaults.headers.common.authorization;
      Router.push(paths.LOGIN);
    }
    if (err) return Promise.reject(err);
  },
);

export interface AxiosErrorData {
  message: string;
  statusCode: number;
  translate?: string;
}
