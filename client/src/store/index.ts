import AppAuthStore from './app.auth'; 
import AppNotificationStore from './app.notifications';
import AppConfigStore from './app.config';

export default class RootStore {
  public app: { 
    auth: AppAuthStore, 
    config: AppConfigStore,
    notifications: AppNotificationStore 
  };

  constructor() {
    this.app = {
      auth: new AppAuthStore(this),
      config: new AppConfigStore(this),
      notifications: new AppNotificationStore(this),
    }
  }
}
