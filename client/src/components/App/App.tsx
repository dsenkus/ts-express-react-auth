import React, { useContext } from 'react';
import { Router } from 'react-router';
import history from '../../history';
import AppUnauthenticated from '../AppUnauthenticated/AppUnauthenticated';
import { StoreContext } from '../../storePovider';
import './App.css';
import PageNotifications from '../PageNotification';

const App: React.FC = () => {
  const { app } = useContext(StoreContext);
  return (
    <Router history={history}>
      <div>
        <PageNotifications />
        { app.auth.isAuthenticated ? <h1>Logged in</h1> : <AppUnauthenticated /> }
      </div>
    </Router>
  );
}

export default App;
