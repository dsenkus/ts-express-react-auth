import React, { FunctionComponent } from 'react';
import { Link, Route } from 'react-router-dom'
import { Icon } from '@blueprintjs/core';

interface Props { 
  to: string
  exact: boolean
  onClick?: () => void
}

const ChevronLink: FunctionComponent<Props> = ({ to, exact, children, onClick }) => {
  return (
    <Route path={to} exact={exact}
      children={({ match }) => (
        <Link to={to} className={match ? 'active' : ''} onClick={onClick}>
          {children}
          {match ? <Icon className="chevron" icon="chevron-right"/> : null}
        </Link>
      )}/>
  )
};

export default ChevronLink;
