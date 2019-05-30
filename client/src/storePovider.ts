import * as React from 'react';
import { configure } from 'mobx';
import RootStore from './store';

// configure mobx store
configure({ enforceActions: 'always' });

// StoreContext
export const store = new RootStore();
export const StoreContext = React.createContext(store);
