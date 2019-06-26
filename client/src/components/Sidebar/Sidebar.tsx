import React, { useContext } from 'react';
import './Sidebar.css';
import { Icon } from '@blueprintjs/core';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../storePovider';
import ChevronLink from '../ChevronLink/ChevronLink';

const Sidebar = observer(() => {
  const { app } = useContext(StoreContext);

  const closeSidebar = () => app.config.showSidebar && app.config.toggleSidebar();

  return (
    <div className="Sidebar">
      <h3 className="mt4 mb3 f6 padh">SIDEBAR MENU</h3>

      <h3 className="mt4 mb3 f6 padh">MY MENU</h3>
      <ul className="menu">
        <li>
          <ChevronLink to="/settings" exact={true} onClick={closeSidebar}>
            <Icon className="mr2" icon="settings" />
            Settings
          </ChevronLink>
        </li>
        <li>
          <a onClick={() => app.auth.logout()}>
            <Icon className="mr2" icon="log-out" />
            Log Out
        </a>
        </li>
      </ul>
    </div>
  );
});

export default Sidebar;
