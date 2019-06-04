import { observable, action } from 'mobx';
import RootStore from '.';

const isMobile = (): boolean => Boolean(window && window.innerWidth < 960); 

export default class AppConfigStore {
  public rootStore: RootStore

  @observable public isMobile = isMobile();
  @observable public showSidebar = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    // toggle isMobile on window resize
    if(window) {
      window.addEventListener('resize', this.setIsMobile);
    }
  }

  @action public toggleSidebar = () => this.showSidebar = !this.showSidebar
  @action public setIsMobile = () => this.isMobile = isMobile()
}
