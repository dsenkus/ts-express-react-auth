import React, { useContext } from 'react';
import classNames from 'classnames';
import './AppAuthenticated.css';
import { observer } from 'mobx-react-lite';
import { Switch, Route } from 'react-router';
import { StoreContext } from '../../storePovider';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import SettingsPage from '../../pages/SettingsPage/SettingsPage';

const AppAuthenticated = observer(() => {
  const { app } = useContext(StoreContext);
  const { isMobile, showSidebar } = app.config;

  return (
    <div className={classNames('AppAuthenticated', {'AppAuthenticated--withSidebar': isMobile && showSidebar})}>
      <div className="AppAuthenticated-Header">
        <Header/>
      </div>

      {(!isMobile || showSidebar) &&
        <div className="AppAuthenticated-Sidebar">
          <Sidebar/>
        </div>}

      <div className="AppAuthenticated-Content">
        <div className="AppAuthenticated-Wrapper">
          <Switch>
            <Route path="/settings" component={SettingsPage} />
          </Switch>
        </div>
      </div>

      <div className="AppAuthenticated-Footer">
        <div className="padh">
          &copy; 2019. All Rights Reserved.
        </div>
      </div>
    </div>
  );
});

export default AppAuthenticated;
