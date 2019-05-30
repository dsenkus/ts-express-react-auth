import React, { useState, useContext } from 'react'
import useReactRouter from 'use-react-router';
import { FormGroup, InputGroup, Button, Intent } from '@blueprintjs/core';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../storePovider';
import { useForm } from '../../utils/useForm';

const PasswordResetStep1Form = observer(() => {
  const [email, setEmail] = useState('');
  const { app } = useContext(StoreContext);
  const { history } = useReactRouter();

  const { loading, submitHandler } = useForm(async () => {
    await app.auth.sendPasswordResetEmail(email);
    history.push('/');
  });

  return (
    <div className="PasswordResetFormStep1">
      <p>Forgot your password? Enter your email and we will send you instructions on how to reset it.</p>

      <form onSubmit={submitHandler}>
        <FormGroup>
          <InputGroup 
            leftIcon="envelope"
            placeholder="Enter your email.."
            value={email}
            large={true}
            onChange={(e: any) => setEmail(e.target.value)}/>
        </FormGroup>

        <Button
          className="mt4"
          type="submit"
          intent={Intent.PRIMARY} 
          fill={true}
          large={true}
          loading={loading}>
          Reset Password
        </Button>
      </form>
    </div>
  );
});

export default PasswordResetStep1Form;
