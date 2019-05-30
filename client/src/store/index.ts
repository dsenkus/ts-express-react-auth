import AppAuthStore from './app.auth'; 
import AppNotificationStore from './app.notifications';

export default class RootStore {
  public app: { auth: AppAuthStore, notifications: AppNotificationStore };

  constructor() {
    this.app = {
      auth: new AppAuthStore(this),
      notifications: new AppNotificationStore(this),
    }
  }
}
