import { decrypt, encrypt } from '@hopehome/encrypter';
import axios, { AxiosInstance } from 'axios';

export async function getCurrentIp() {
  const { data: ip_address } = await axios.get('https://api.ipify.org');
  return ip_address as string;
}

export const baseURL =
  process.env['NX_API_BASE_URL'] || 'https://api.hopehome.app';

function axiosInstance(): AxiosInstance {
  const axiosInstance = axios.create({
    baseURL,
  });
  axiosInstance.interceptors.request.use(
    (request) => {
      if (typeof window !== 'undefined')
        request.headers.set(
          'Authorization',
          `Bearer ${localStorage.getItem('hh-token')}`
        );
      request = {
        ...request,
        params: request.params ? { data: encrypt(request.params) } : undefined,
        data:
          typeof window !== 'undefined' && request.data instanceof FormData
            ? request.data
            : request.data
            ? { data: encrypt(request.data) }
            : undefined,
      };
      return request;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      response = {
        ...response,
        data: response.data ? decrypt(response.data) : {},
      };
      return response;
    },
    (error) => {
      if (
        error.response?.data?.statusCode === 403 &&
        location.pathname !== '/signin'
      )
        location.href = '/signin';
      return Promise.reject(
        error.response?.data || 'Sorry, this error is not supposed to happen'
      );
    }
  );

  return axiosInstance;
}
export const http = axiosInstance();
