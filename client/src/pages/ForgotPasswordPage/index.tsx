import React from 'react'
import { Link } from 'react-router-dom'
import useReactRouter from 'use-react-router';
import PasswordResetStep1Form from '../../components/PasswordResetStep1Form';
import PasswordResetFormStep2 from '../../components/PasswordResetStep2Form';

const ForgotPasswordPage = () => {
  const { match } = useReactRouter();

  // @ts-ignore
  const { token } = match.params; 

  return (
    <div className="ForgotPasswordPage">
      {token ? <PasswordResetFormStep2 token={token} /> : <PasswordResetStep1Form />}
      <p className="pt3 tc">Go back to <Link to="/">sign in</Link> </p>
    </div>
  );
};
 
export default ForgotPasswordPage;
