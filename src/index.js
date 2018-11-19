import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'

import './index.css'

import Kettle from './main'

const App = () => (
  <Router>
    <div>
      <header />
      <Kettle />
    </div>
  </Router>
)

ReactDOM.render(<App />, document.getElementById('root'))
