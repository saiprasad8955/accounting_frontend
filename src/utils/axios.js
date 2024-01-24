import axios from 'axios';
// config
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  customer: {
    add: '/customer/add',
    update: '/customer/update',
    list: '/customer/list',
    delete: '/customer/delete',
  },
  vendor: {
    add: '/vendor/add',
    update: '/vendor/update',
    list: '/vendor/list',
    delete: '/vendor/delete',
  },
  offer: {
    add: '/offer/add',
    update: '/offer/update',
    list: '/offer/list',
    delete: '/offer/delete',
  },
  expenditure: {
    add: '/expenditure/add',
    update: '/expenditure/update',
    list: '/expenditure/list',
    delete: '/expenditure/delete',
  },
  product: {
    add: '/product/add',
    update: '/product/update',
    list: '/product/list',
    delete: '/product/delete',
    category: {
      add: '/product/category/add',
      update: '/product/category/update',
      list: '/product/category/list',
      delete: '/product/category/delete',
    },
  },
  productBarcodeValues: {
    add: '/productbarcode/add',
    update: '/productbarcode/update',
    details: '/productbarcode/details',
  },
  auth: {
    me: '/user/getProfile',
    login: '/auth/login',
    // register: '/api/auth/register',
  },
};
