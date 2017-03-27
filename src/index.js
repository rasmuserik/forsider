import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import loadScript from './load-script.js';

async function render() {
  const Main = require('./Main').default;
  await loadScript('https://openplatform.dbc.dk/v1/dbc_openplatform.min.js');
  ReactDOM.render(
    <MuiThemeProvider>
      <Main/>
    </MuiThemeProvider>, 
    document.getElementById('root'));
};

render();
module.hot && module.hot.accept('./Main', render);
