import { observable, action } from 'mobx';
import { Intent } from '@blueprintjs/core';
import  uniqid from 'uniqid';
import RootStore from '.';

export default class AppNotificationStore {
  public rootStore: RootStore

  @observable public notifications: AppNotification[] = [];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @action public addSuccess = (message: string, sticky = false ) => {
    this.notifications.push({
      id: uniqid(),
      message,
      variant: Intent.SUCCESS,
      sticky
    });
  }

  @action public addFail = (message: string, sticky = false ) => {
    this.notifications.push({
      id: uniqid(),
      message,
      variant: Intent.DANGER,
      sticky
    });
  }

  @action public addWarning = (message: string, sticky = false ) => {
    this.notifications.push({
      id: uniqid(),
      message,
      variant: Intent.WARNING,
      sticky
    });
  }

  @action public delete = (id: string) => {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  @action public reset = () => {
    this.notifications = [];
  }
}
