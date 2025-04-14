// import api from './apiConfig';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const requestOtp = async (email: string) => {
//   try {
//     const response = await api.post('/api/customer/create-customer-user-request-verify-otp', { email });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const registerCustomer = async (payload: {
//   userInfomation: {
//     email: string;
//     phone: string;
//     fullname: string;
//     address: string;
//     gender: number;
//     roleId: number;
//   };
//   otp: string;
//   password: string;
// }) => {
//   try {
//     const response = await api.post('/api/customer/register-customer-user', payload);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const login = async (payload: { email: string; password: string }) => {
//   try {
//     const response = await api.post('/api/login', payload);

//     // if (response.data.token) {
//     //   await AsyncStorage.setItem('token', response.data.token);
//     // }
//     if (response.data.data) {
//       // Store the token
//       await AsyncStorage.setItem('token', response.data.data.token);
//       // Store the user data
//       await AsyncStorage.setItem('user', JSON.stringify(response.data.data));
//     }
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
import api from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const requestOtp = async (email: string) => {
  try {
    const response = await api.post('/api/customer/create-customer-user-request-verify-otp', { email });
    return response.data;
  } catch (error: any) {
    throw error; 
  }
};

export const registerCustomer = async (payload: {
  userInfomation: {
    email: string;
    phone: string;
    fullname: string;
    address: string;
    gender: number;
    roleId: number;
  };
  otp: string;
  password: string;
}) => {
  try {
    const response = await api.post('/api/customer/register-customer-user', payload);
    return response.data;
  } catch (error: any) {
   
    throw error; // Throw the message directly as a string
  }
};

export const login = async (payload: { email: string; password: string }) => {
  try {
    const response = await api.post('/api/login', payload);
    console.log('Login response:', response.data); 
    if (response.data.data) {
      await AsyncStorage.setItem('token', response.data.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  } catch (error: any) {
    console.error('Login Fail:', error); 
    throw error;
  }
};