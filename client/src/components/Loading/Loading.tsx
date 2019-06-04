import React, { FunctionComponent } from 'react';
import { Spinner } from '@blueprintjs/core';

const Loading: FunctionComponent = () => {
  return (
    <div className="absolute absolute--fill bg-white-60 flex items-center justify-center">
      <Spinner/>
    </div>
  )
};

export default Loading;
