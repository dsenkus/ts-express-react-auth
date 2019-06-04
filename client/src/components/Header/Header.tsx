import React, { useContext } from 'react';
import { Navbar, Alignment, Button } from '@blueprintjs/core'
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../storePovider';
import AccountActions from '../AccountActions/AccountActions';
import logo from '../../assets/logo.png';
import './Header.css';

const Header = observer(() => {
  const { app } = useContext(StoreContext);

  return (
    <div className="Header">
      <Navbar className="bp3-dark">
        <Navbar.Group align={Alignment.LEFT}>
          {app.config.isMobile &&
            <>
              <Button 
                onClick={() => app.config.toggleSidebar() }
                icon="menu" 
                minimal={true} />
              <Navbar.Divider />
            </>}

            <Navbar.Heading>
              <Link to="/">
                <img className="db" src={logo} style={{
                  height: '1.5rem'
                }}/>
              </Link>
            </Navbar.Heading>
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          <Navbar.Divider />
          <AccountActions />
        </Navbar.Group>
      </Navbar>
    </div>
  )
});

export default Header;
