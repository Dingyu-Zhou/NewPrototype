import 'core-js/es6/map'
import 'core-js/es6/set'
import 'raf/polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

import registerServiceWorker from './registerServiceWorker'
import './index.css'
import App from './controller/layout/App'

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
