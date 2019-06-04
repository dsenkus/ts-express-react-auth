import React, { useContext } from 'react';
import useReactRouter from 'use-react-router';
import { Menu, MenuItem, Popover, Position, Button, MenuDivider } from '@blueprintjs/core';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../storePovider';

const AccountActions = observer(() => {
  const { app } = useContext(StoreContext);
  const { history } = useReactRouter();

  const menu = (
    <Menu>
      <MenuItem 
        icon="settings" 
        onClick={() => history.push('/settings')}
        text="Settings"
        />
      <MenuDivider/>
      <MenuItem icon="log-out" text="Logout" onClick={() => app.auth.logout()}/>
    </Menu>
  );

  return (
    <Popover content={menu} position={Position.BOTTOM_LEFT}>
      <Button className="bp3-minimal" icon="user" text={!app.config.isMobile && app.auth.user.name} />
    </Popover>
  )
});

export default AccountActions;
