import axios from 'axios';
import { UserCreateData, UserUpdateData } from '../../types/common';
import { store } from './storePovider';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'content-type': 'application/json' 
  },
  withCredentials: true,
});

instance.interceptors.request.use((request) => {
  console.log(`${request.baseURL}${request.url}`);
  return request;
});

instance.interceptors.response.use((response) => {
  if(response.status === 401 && response.data.error && response.data.error.type === 'UnauthorizedError') {
    // force logout user when received UnauthorizedError from server
    // this error means that user session id is invalid
    store.app.auth.logout();
  }
  return response;
});

/*--------------------------------------------------------------------------------------------------------------------
  Auth endpoints
  ------------------------------------------------------------------------------------------------------------------*/

const auth = {
  login: function(email: string, password: string, rememberMe: boolean) {
    return instance.post(`/auth/login`, {
      email, password, rememberMe
    });
  },

  logout: function() {
    return instance.post(`/auth/logout`);
  },

  whoami: function() {
    return instance.get(`/auth/whoami`);
  },

  confirm: function(token: string) {
    return instance.post(`/auth/confirm`, { token });
  },

  register: function(data: UserCreateData) {
    return instance.post(`/auth/register`, data);
  },

  updateProfile: function(data: UserUpdateData) {
    return instance.post(`/auth/update_profile`, data);
  },

  sendPasswordResetEmail: (email: string) => {
    return instance.post(`/auth/request_password_reset`, { email });
  },

  resetPassword: (token: string, password: string) => {
    return instance.post(`/auth/change_password`, { token, password });
  },

  changePassword: (password: string, currentPassword: string, confirmPassword: string) => {
    return instance.post(`/auth/change_password`, { password, currentPassword, confirmPassword });
  },

  deleteAccount: (password: string) => {
    return instance.post(`/auth/delete_account`, { password });
  },
}

export const api = {
  auth
}
