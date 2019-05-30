import React, { useState, useContext } from 'react';
import { FormGroup, InputGroup, Button, Intent, Checkbox } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../storePovider';
import { useForm } from '../../utils/useForm';

const LoginForm = observer(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const { app } = useContext(StoreContext);

  const { loading, submitHandler } = useForm(async () => {
    await app.auth.login(email, password, rememberMe);
  })

  return (
    <form onSubmit={submitHandler}>
      <FormGroup>
        <InputGroup 
          autoFocus={true}
          leftIcon="user"
          placeholder="Enter your email.."
          type="email"
          value={email}
          large={true}
          onChange={(e: any) => setEmail(e.target.value)} 
          />
      </FormGroup>

      <FormGroup>
        <InputGroup 
          leftIcon="more"
          placeholder="Enter your password..."
          value={password}
          large={true}
          onChange={(e: any) => setPassword(e.target.value)} 
          type="password"
          />
      </FormGroup>

      <FormGroup>
        <div className="flex items-center">
          <div className="fg1">
            <Checkbox
              checked={rememberMe}
              label="Remember Me"
              onChange={(e: any) => setRememberMe(e.target.checked)}/>
          </div>
          <Link className="mb1" to="/password-reset">Forgot Password?</Link>
        </div>
      </FormGroup>

      <Button 
        type="submit"
        intent={Intent.PRIMARY} 
        fill={true}
        large={true}
        loading={loading}>
        Login
      </Button>
    </form>
  );
});

export default LoginForm;
