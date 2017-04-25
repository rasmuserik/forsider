import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import {scriptPromise} from 'script-promise';

async function render() {
  const Main = require('./Main').default;
  await scriptPromise(
    'https://openplatform.dbc.dk/v1/dbc_openplatform.min.js'
  );
  ReactDOM.render(
    <MuiThemeProvider>
      <Main />
    </MuiThemeProvider>,
    document.getElementById('main')
  );
}

render();
module.hot && module.hot.accept('./Main', render);
