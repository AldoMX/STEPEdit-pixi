import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';

import App from './App';
import './index.css';

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'));
};

WebFont.load({
  google: {
    families: ['Open Sans'],
  },
  active: renderApp,
  inactive: renderApp,
});
