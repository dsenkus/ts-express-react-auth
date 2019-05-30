import React, { useState, useContext, FunctionComponent } from 'react'
import useReactRouter from 'use-react-router';
import { FormGroup, InputGroup, Button, Intent } from '@blueprintjs/core';
import { StoreContext } from '../../storePovider';
import { observer } from 'mobx-react-lite';
import { isValidationError } from '../../utils/errorHandler';
import { JsonError } from '../../../../types/common';

interface IPasswordResetFormStep2 {
  token: string
}

const PasswordResetFormStep2: FunctionComponent<IPasswordResetFormStep2> = observer(({ token }) => {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<JsonError | null>(null);
  const { history } = useReactRouter();
  const { app } = useContext(StoreContext);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      if(await app.auth.resetPassword(token, password)) {
        setError(null);
        // go to login page and show notification
        history.push('/');
      }
    } catch (e) {
      if(isValidationError(e)) {
        setError(e.response.data);
      }
    }
    setLoading(false);
  }

  const passwordConfirmed = password === passwordConfirm;

  return (
    <div className="PasswordResetFormStep2">
      <form onSubmit={handleSubmit}>
        <FormGroup
          intent={error && error.data.password ? 'danger' : 'none'}
          helperText={error && error.data.password}>
          <InputGroup 
            leftIcon="more"
            placeholder="Enter your password..."
            value={password}
            large={true}
            onChange={(e: any) => setPassword(e.target.value)} 
            type="password"
            />
        </FormGroup>

        <FormGroup
          intent={!passwordConfirmed ? 'danger' : 'none'}
          helperText={!passwordConfirmed && 'password confirmation does not match'}>
          <InputGroup 
            leftIcon="more"
            placeholder="Repeat your password..."
            value={passwordConfirm}
            large={true}
            onChange={(e: any) => setPasswordConfirm(e.target.value)} 
            type="password"
            />
        </FormGroup>

        <Button
          className="mt4"
          type="submit"
          intent={Intent.PRIMARY} 
          fill={true}
          large={true}
          disabled={!password || (password !== passwordConfirm) }
          loading={loading}>
          Change Password
        </Button>
      </form>
    </div>
  );
});

export default PasswordResetFormStep2;
