import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

ReactDOM.render(<MuiThemeProvider><Main/></MuiThemeProvider>, document.getElementById('root'));
