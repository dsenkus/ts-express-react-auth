import * as React from 'react';
import bg from '../../assets/green_fibers.png';
import ForgotPasswordPage from '../../pages/ForgotPasswordPage';
import LoginPage from '../../pages/LoginPage';
import logo from '../../assets/logo.png';
import RegisterPage from '../../pages/RegisterPage';
import { Link, Route, Switch } from 'react-router-dom';
import './AppUnauthenticated.css';

const headerStyles = {
  backgroundImage: `url(${bg})`
}

const AppUnauthenticated = () => {
  return (
    <div className="AppUnauthenticated">
      <div className="auth-box flex flex-column center min-vh-100 justify-center ph3">
        <div className="shadow-40">
          <div className="auth-box-header cover w-140 tc pa4" style={headerStyles}>
            <Link to="/"><img src={logo} alt="Logo" style={{ height: '2.5rem' }}/></Link>
          </div>

          <div className="auth-box-content w-100 bg-white pad">
            <Switch>
              <Route path="/register" component={RegisterPage} />
              <Route path="/password-reset/:token" component={ForgotPasswordPage} />
              <Route path="/password-reset" component={ForgotPasswordPage} />
              <Route path="/confirm/:token" component={LoginPage} />
              <Route path="/" component={LoginPage} />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppUnauthenticated;
