import React, { useContext, useEffect, useState } from 'react';
import { Router } from 'react-router';
import history from '../../history';
import AppUnauthenticated from '../AppUnauthenticated/AppUnauthenticated';
import { StoreContext } from '../../storePovider';
import './App.css';
import PageNotifications from '../PageNotification';
import { observer } from 'mobx-react-lite';
import AppAuthenticated from '../AppAuthenticated';
import Loading from '../Loading/Loading';

const App: React.FC = observer(() => {
  const { app } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    setLoading(true);
    await app.auth.whoami();
    setLoading(false);
  }

  // try loading user data from server
  useEffect(() => { fetchUserData() }, []);

  if(loading) {
    return (<Loading/>);
  }

  return (
    <Router history={history}>
      <div>
        <PageNotifications />
        { app.auth.isAuthenticated ? <AppAuthenticated /> : <AppUnauthenticated /> }
      </div>
    </Router>
  );
});

export default App;
