import React, { FunctionComponent } from 'react';

interface Props { 
  title: string
}

const PageTitle: FunctionComponent<Props> = ({ title, children }) => {
  return (
    <div className="page-header mt2 mb3 bb b--black-05 flex">
      <h1 className="mt0 mb2 fg1">{title}</h1>
      {children && <div className="actions fs0">{children}</div>}
    </div>
  )
};

export default PageTitle;
