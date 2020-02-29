import React from 'react';
import { Nuomi } from 'nuomi';
import layout from './pages/layout';
import nginx from './pages/nginx';
import './assets/style.scss';

const App = () => {
  return <Nuomi {...layout}>{() => <Nuomi {...nginx} />}</Nuomi>;
};

export default App;
