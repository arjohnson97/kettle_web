import React from 'react';
import ReactDOM from 'react-dom';
import styles from './index.css';

import menuBar from './menuBar';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Kettle from './main.js';

import { lightBlue800 } from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  palette: {
    //textColor: 'white'
  },
  appBar: {
    height: 50,
    color: lightBlue800
  },
  textField: {
    textColor: 'white'
  }
});

const App = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <div>

      <Kettle />
    </div>
  </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
