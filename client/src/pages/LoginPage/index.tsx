import React, { useState, useEffect, useContext } from 'react';
import useReactRouter from 'use-react-router'
import { Link } from 'react-router-dom';
import LoginForm from '../../components/LoginForm';
import { Spinner } from '@blueprintjs/core';
import { StoreContext } from '../../storePovider';

const LoginPage = () => {
  const { match } = useReactRouter();
  const { token } = match.params as any;
  const { app } = useContext(StoreContext);
  const [confirmationLoading, setConfirmationLoading] = useState(false);

  const submitConfirmation = async (token: string) => {
    setConfirmationLoading(true);
    try {
      await app.auth.confirm(token);
    } catch (err) {

    } finally {
      setConfirmationLoading(false);
    }
  }

  useEffect(() => {
    if(token && token.length === 32) {
      submitConfirmation(token);
    }
  }, [token]);

  return (
    <div className="LoginPage">
      {confirmationLoading && <div className="mv3 tc"><Spinner /></div>}
      <LoginForm />
      <p className="tc mt3">
        I'm new here. <Link to="/register">I want an account</Link>
      </p>
    </div>
  );
};

export default LoginPage;
