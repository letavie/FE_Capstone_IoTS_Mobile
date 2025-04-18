
// // import axios from 'axios';
// // import { router } from 'expo-router';
// // import asyncStorageService from './../storage/AsyncStorageService';

// // const API_URL = 'https://iottraddingsystem-c4engkb2ftgwakd7.southeastasia-01.azurewebsites.net';

// // const api = axios.create({
// //   baseURL: API_URL,
// //   headers: {
// //     'Content-Type': 'application/json',
// //   },
// // });



// // api.interceptors.request.use(
// //   async (config) => {
// //     try {
// //       const token = await asyncStorageService.getItem<string>('token');
// //       if (token) {
// //         config.headers['Authorization'] = `Bearer ${token}`;
// //       }
// //     } catch (error) {
// //       console.error('Request Interceptor Error:', error);
// //     }
// //     return config;
// //   },
// //   (error) => Promise.reject(error)
// // );

// // api.interceptors.response.use(
// //   (response) => response,
// //   async (error) => {
// //     console.error('API Error:', error);

// //     if (error.response?.status === 401) {
// //       console.error('Unauthorized error:', error.response?.data);
// //       await asyncStorageService.clear();
// //       router.replace('/auth/Login');
// //       return Promise.reject(new Error('Token expired. Please log in again.'));
// //     }

// //     return Promise.reject(
// //       error.response?.data?.message || 'An error occurred, please try again.'
// //     );
// //   }
// // );

// // export default api;

// import axios from 'axios';
// import { router } from 'expo-router';
// import asyncStorageService from '../storage/AsyncStorageService';

// const API_URL = 'https://iottraddingsystem-c4engkb2ftgwakd7.southeastasia-01.azurewebsites.net';

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Danh sách các endpoint không yêu cầu token
// const publicEndpoints = [
//   '/api/iot-device/get-pagination',
//   '/api/combo/get-pagination',
//   '/api/material-category/get-all-material-categories',
//   `/api/combo/get-combo-details`,
// ];

// api.interceptors.request.use(
//   async (config) => {
//     // Kiểm tra nếu endpoint nằm trong danh sách công khai thì không thêm token
//     const isPublicEndpoint = publicEndpoints.some((endpoint) =>
//       config.url?.includes(endpoint)
//     );

//     if (!isPublicEndpoint) {
//       try {
//         const token = await asyncStorageService.getItem<string>('token');
//         if (token) {
//           config.headers['Authorization'] = `Bearer ${token}`;
//         }
//       } catch (error) {
//         console.error('Request Interceptor Error:', error);
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     console.error('API Error:', error);

//     if (error.response?.status === 401) {
//       console.error('Unauthorized error:', error.response?.data);
//       await asyncStorageService.clear();
//       router.replace('/auth/Login');
//       return Promise.reject(new Error('Token expired. Please log in again.'));
//     }

//     return Promise.reject(
//       error.response?.data?.message || 'An error occurred, please try again.'
//     );
//   }
// );

// export default api;

import axios from 'axios';
import { router } from 'expo-router';
import asyncStorageService from '../storage/AsyncStorageService';

const API_URL = 'https://iottraddingsystem-c4engkb2ftgwakd7.southeastasia-01.azurewebsites.net';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const publicEndpoints = [
  '/api/iot-device/get-pagination',
  '/api/combo/get-pagination',
  '/api/material-category/get-all-material-categories',
  `/api/combo/get-combo-details`,
];

api.interceptors.request.use(
  async (config) => {
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    if (!isPublicEndpoint) {
      try {
        const token = await asyncStorageService.getItem<string>('token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        } else {
          console.warn('No token found in AsyncStorage');
        }
      } catch (error) {
        console.error('Request Interceptor Error:', error);
        // Proceed without the token; the response interceptor will handle 401 errors
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', error);

    if (error.response?.status === 401) {
      console.error('Unauthorized error:', error.response?.data);
      await asyncStorageService.clear();
      router.replace('/auth/Login');
      return Promise.reject(new Error('Token expired. Please log in again.'));
    }

    return Promise.reject(
      error.response?.data?.message || 'An error occurred, please try again.'
    );
  }
);

export default api;