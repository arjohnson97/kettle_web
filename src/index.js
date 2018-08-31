import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import header from './components/header';
import Kettle from './main';


const App = () => (
  <div>
    <header />
    <Kettle />
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
