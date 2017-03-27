import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import loadScript from './load-script.js';

(async () => {
  await loadScript('https://openplatform.dbc.dk/v1/dbc_openplatform.min.js');
  ReactDOM.render(
    <MuiThemeProvider>
      <Main/>
    </MuiThemeProvider>, 
    document.getElementById('root'));
})();
