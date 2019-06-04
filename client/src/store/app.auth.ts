import { observable, action, computed, flow, observe, autorun } from 'mobx';
import RootStore from './index';
import { UserAuthData, UserCreateData, UserUpdateData } from '../../../types/common';
import { api } from '../api';
import { baseErrorHandler } from '../utils/errorHandler';

export default class AppAuthStore {
  public rootStore: RootStore

  @observable public user: UserAuthData = { id: '', email: '', name: ''  };

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @computed public get isAuthenticated() {
    return Boolean(this.user.email.length > 0 && this.user.id.length > 0 && this.user.name.length > 0);
  }

  public login = flow(function * login(this: AppAuthStore, email: string, password: string, rememberMe: boolean) {
    try {
      const { data } = yield api.auth.login(email, password, rememberMe);
      this.user = data.user;

      // delete all notifications on successful login
      this.rootStore.app.notifications.reset();

      return true;
    } catch (error) {
      const jsonError = baseErrorHandler(error);
      if(jsonError) this.rootStore.app.notifications.addFail(jsonError.message);
      return false;
    }
  })

  public logout = flow(function * logout(this: AppAuthStore) {
    try {
      yield api.auth.logout();
      this.user = { id: '', email: '', name: ''  };
      return true;
    } catch (error) {
      const jsonError = baseErrorHandler(error);
      if(jsonError) {
        this.rootStore.app.notifications.addFail(jsonError.message);
      }
      return false;
    }
  });

  public whoami = flow(function * whoami(this: AppAuthStore) {
    try {
      const { data } = yield api.auth.whoami();
      this.user = data.user;
      return true;
    } catch (error) {
      const jsonError = baseErrorHandler(error);
      if(jsonError && jsonError.type ===  'UnauthorizedError') {
        // ignore unauthorized errors
      } else if(jsonError) {
        this.rootStore.app.notifications.addFail(jsonError.message);
      }
      return false;
    }
  });

  /**
   * register new user
   */
  public register = flow(function * register(this: AppAuthStore, data: UserCreateData) {
    try {
      yield api.auth.register(data);
      this.rootStore.app.notifications.addSuccess(
        'Registration successful. Please check your email for confirmation link.', 
        true);
      return true;
    } catch (error) {
      const jsonError = baseErrorHandler(error);
      if(jsonError && jsonError.type === 'ValidationError') {
        throw error; // handle in react component
      } else if (jsonError) {
        this.rootStore.app.notifications.addFail(jsonError.message);
      }
      return false;
    }
  });

  /**
   * update user profile
   */
  public updateProfile = flow(function * updateProfile(this: AppAuthStore, data: UserUpdateData) {
    try {
      const response = yield api.auth.updateProfile(data);
      this.user = response.data.user;
      this.rootStore.app.notifications.addSuccess('Your profile was successfully updated.');
      return true;
    } catch (error) {
      const jsonError = baseErrorHandler(error);
      if(jsonError && jsonError.type === 'ValidationError') {
        throw error; // handle in react component
      } else if (jsonError) {
        this.rootStore.app.notifications.addFail(jsonError.message);
      }
      return false;
    }
  });

  /**
   * confirm user
   */
  public confirm = flow(function * register(this: AppAuthStore, token: string) {
    try {
      yield api.auth.confirm(token);
      this.rootStore.app.notifications.addSuccess('Your account is now confirmed. Please sign in.', true);
      return true;
    } catch (error) {
      const jsonError = baseErrorHandler(error);
      if(jsonError) this.rootStore.app.notifications.addFail(jsonError.message);
      return false;
    }
  })

  /**
   * change password
   */
  public changePassword = flow(function * changePassword(this: AppAuthStore, password: string, currentPassword: string, confirmPassword: string) {
    try {
      yield api.auth.changePassword(password, currentPassword, confirmPassword);
      this.rootStore.app.notifications.addSuccess( 'Password succesfully changed, please login.', true);
      return true;
    } catch (error) {
      const jsonError = baseErrorHandler(error);
      if(jsonError && jsonError.type === 'ValidationError') {
        throw error; // handle in react component
      } else if (jsonError) {
        this.rootStore.app.notifications.addFail(jsonError.message);
      }
      return false;
    }
  });

  /**
   * Password reset step 1
   * sends pass reset email
   */
  public sendPasswordResetEmail = flow(function * sendPasswordResetEmail(this: AppAuthStore, email: string) {
    try {
      yield api.auth.sendPasswordResetEmail(email);
      this.rootStore.app.notifications.addSuccess(
        'Futher instructions on how to reset your password have been sent to your email.',
        true);
      return true;
    } catch (error) {
      const jsonError = baseErrorHandler(error);
      if(jsonError) this.rootStore.app.notifications.addFail(jsonError.message);
      return false;
    }
  });

  /**
   * Password reset step 2
   * change password with provided token
   */
  public resetPassword = flow(function * resetPassword(this: AppAuthStore, token: string, password: string) {
    try {
      yield api.auth.resetPassword(token, password);
      this.rootStore.app.notifications.addSuccess( 'Password succesfully changed, please login.', true);
      return true;
    } catch (error) {
      const jsonError = baseErrorHandler(error);
      if(jsonError && jsonError.type === 'ValidationError') {
        throw error; // handle in react component
      } else if (jsonError) {
        this.rootStore.app.notifications.addFail(jsonError.message);
      }
      return false;
    }
  });

  /**
   * Password reset step 2
   * change password with provided token
   */
  public deleteAccount = flow(function * deleteAccount(this: AppAuthStore, password: string) {
    try {
      yield api.auth.deleteAccount(password);
      this.logout();
      this.rootStore.app.notifications.addWarning('Your account was successfully deleted.', true);
      return true;
    } catch (error) {
      const jsonError = baseErrorHandler(error);
      if(jsonError && jsonError.type === 'ValidationError') {
        throw error; // handle in react component
      } else if (jsonError) {
        this.rootStore.app.notifications.addFail(jsonError.message);
      }
      return false;
    }
  });
}
