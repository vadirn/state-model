import { useDeps } from 'components-di';
import React from 'react';

import { addComponent, addController, start } from './src/Session';

addComponent(
  'example',
  {},
  useDeps((context, actions) => ({ ...context.store.state, actions }))(({ example }) => <div>{example}</div>),
  { example: 'Example' }
);

start();
