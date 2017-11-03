import React from 'react';
import ReactDOM from 'react-dom';
import bootstrap from './bootstrap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './global.styl';

export default (View, formConfig) => {
  ReactDOM.render((
    <MuiThemeProvider>
      { bootstrap(View, formConfig) }
    </MuiThemeProvider>
  ), document.getElementById('content'));
};
