import React, { useState, useContext } from 'react';
import useReactRouter from 'use-react-router';
import { FormGroup, InputGroup, Button, Intent } from '@blueprintjs/core';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../storePovider';
import { useForm } from '../../utils/useForm';

const RegisterForm = observer(() => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const { app } = useContext(StoreContext);
  const { history } = useReactRouter();

  const { loading, error, submitHandler } = useForm(async () => {
    if(await app.auth.register({ name, email, password })) {
      history.push('/');
    }
  });

  const passwordConfirmed = password === passwordConfirm;

  return (
    <form onSubmit={submitHandler}>
      <FormGroup
        intent={error && error.data.name ? Intent.DANGER : Intent.NONE}
        helperText={error && error.data.name}>
        <InputGroup 
        intent={error && error.data.name ? Intent.DANGER : Intent.NONE}
          leftIcon="user"
          placeholder="Enter your full name.."
          value={name}
          large={true}
          onChange={(e: any) => setName(e.target.value)}/>
      </FormGroup>

      <FormGroup
        intent={error && error.data.email ? Intent.DANGER : Intent.NONE}
        helperText={error && error.data.email}>
        <InputGroup 
          intent={error && error.data.email ? Intent.DANGER : Intent.NONE}
          type="email"
          leftIcon="envelope"
          placeholder="Enter your email.."
          value={email}
          large={true}
          onChange={(e: any) => setEmail(e.target.value)}/>
      </FormGroup>

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

      <div className="pa0 gray">
        By registering you agree to our <a href="/policies">policies</a>.
      </div>

      <Button
        className="mt3"
        type="submit"
        intent={Intent.PRIMARY} 
        fill={true}
        large={true}
        loading={loading}>
        Register
      </Button>
    </form>
  );
});

export default RegisterForm;
