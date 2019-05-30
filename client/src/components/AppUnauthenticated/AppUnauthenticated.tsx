import * as React from 'react';
// import LoginPage from '../../pages/LoginPage/LoginPage';
import {
  Route,
  Switch
} from 'react-router-dom';
// import RegisterPage from '../../pages/RegisterPage/RegisterPage';
// import ForgotPasswordPage from '../../pages/ForgotPasswordPage/ForgotPasswordPage';
// import PageNotifications from '../PageNotifications/PageNotifications';
import logo from '../../assets/logo_light.png';
import bg from '../../assets/green_fibers.png';
import './AppUnauthenticated.css';
import LoginPage from '../../pages/LoginPage';
import RegisterPage from '../../pages/RegisterPage';
import ForgotPasswordPage from '../../pages/ForgotPasswordPage';

const headerStyles = {
  backgroundImage: `url(${bg})`
}

const AppUnauthenticated = () => {
  return (
    <div className="AppUnauthenticated">
      {/* <PageNotifications /> */}

      <div className="auth-box flex flex-column center min-vh-100 justify-center ph3">
        <div className="shadow-40">
          <div className="auth-box-header cover w-140 tc pa4" style={headerStyles}>
            <a href="/"><img src={logo} alt="Logo" style={{ height: '2.5rem' }}/></a>
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
