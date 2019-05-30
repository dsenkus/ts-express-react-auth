import React, { useState, useContext, FunctionComponent } from 'react'
import useReactRouter from 'use-react-router';
import { FormGroup, InputGroup, Button, Intent } from '@blueprintjs/core';
import { StoreContext } from '../../storePovider';
import { observer } from 'mobx-react-lite';
import { isValidationError } from '../../utils/errorHandler';
import { JsonError } from '../../../../types/common';
import { useForm } from '../../utils/useForm';

interface Props {
  token: string
}

const PasswordResetFormStep2: FunctionComponent<Props> = observer(({ token }) => {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const { history } = useReactRouter();
  const { app } = useContext(StoreContext);

  const { loading, error, submitHandler } = useForm(async () => {
      await app.auth.resetPassword(token, password);
      history.push('/');
  })

  const passwordConfirmed = password === passwordConfirm;

  return (
    <div className="PasswordResetFormStep2">
      <p>Reset your password:</p>
      <form onSubmit={submitHandler}>
        <FormGroup
          intent={error && error.data.password ? Intent.DANGER : Intent.NONE}
          helperText={error && error.data.password}>
          <InputGroup 
            intent={error && error.data.password ? Intent.DANGER : Intent.NONE}
            leftIcon="more"
            placeholder="Enter your password..."
            value={password}
            large={true}
            onChange={(e: any) => setPassword(e.target.value)} 
            type="password"
            />
        </FormGroup>

        <FormGroup
          intent={!passwordConfirmed ? Intent.DANGER : Intent.NONE}
          helperText={!passwordConfirmed && 'password confirmation does not match'}>
          <InputGroup 
            intent={!passwordConfirmed ? Intent.DANGER : Intent.NONE}
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
