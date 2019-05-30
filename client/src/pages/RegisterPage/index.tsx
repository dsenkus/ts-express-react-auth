import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../../components/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="RegisterPage">
      <RegisterForm />
      <p className="tc mt3">
        I have an account. <Link to="/">I want to sign in</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
