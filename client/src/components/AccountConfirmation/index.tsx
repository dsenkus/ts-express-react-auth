import React, { FunctionComponent, useState, useContext, useEffect } from 'react';
import useReactRouter from 'use-react-router';
import { api } from '../../api';
import { StoreContext } from '../../storePovider';
import { Spinner } from '@blueprintjs/core';

interface Props {
  token: string
}

const AccountConfirmation:FunctionComponent<Props> = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const { app } = useContext(StoreContext);
  const { history } = useReactRouter();

  // try to confirm token on load
  useEffect(() => {
    handleSubmit();
  }, []);

  const handleSubmit = async() => {
    setLoading(true);

    try {
      await api.auth.confirm(token);
      history.push('/');
      app.notifications.addSuccess('Your account is now confirmed. Please sign in.', true);
    } catch (e) {
      if(e.response && e.response.data && e.response.data.type === 'InvalidConfirmationTokenError') {
        app.notifications.addFail(e.response.data.message);
      } else {
        app.notifications.addFail(e.message);
      }
    }

    setLoading(false);
  }

  if(loading) {
    return (
      <div className="mv3 tc"><Spinner /></div>
    );

  }

  return null; 
};

export default AccountConfirmation;
