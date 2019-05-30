import React, { useContext } from 'react';
import { Toaster, Toast } from '@blueprintjs/core';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../storePovider';

const PageNotifications = observer(() => {
  const { app } = useContext(StoreContext);
  const { notifications } = app.notifications;

  return (
    <Toaster>
      {notifications.map((notification) => (
        <Toast 
          key={notification.id}
          timeout={notification.sticky ? 0 : 5000}
          onDismiss={() => app.notifications.delete(notification.id)}
          message={notification.message} 
          intent={notification.variant} />
      ))}
    </Toaster>
  );
});

export default PageNotifications;
