import axios from 'axios';
import { UserCreateData } from '../../types/common';
import { store } from './storePovider';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'content-type': 'application/json' 
  },
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

  confirm: function(token: string) {
    return instance.post(`/auth/confirm/`, { token });
  },

  register: function(data: UserCreateData) {
    return instance.post(`/auth/register`, data);
  },

  sendPasswordResetEmail: (email: string) => {
    return instance.post(`/auth/reset_password`, { email });
  },

  changePassword: (token: string, password: string) => {
    return instance.post(`/auth/reset_password/${token}`, { password });
  }
}

export const api = {
  auth
}
