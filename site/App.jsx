import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'

import LandingPage from './components/LandingPage.jsx'
import NotFoundPage from './components/NotFoundPage.jsx'
import CreateTimeline from './components/CreateTimeline.jsx'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

const App = () => {
  return (<div>
            <Router>
              <Switch>
                <Route path='/t/:id'>
                  <CreateTimeline />
                </Route>
                <Route path='/notfound'>
                  <NotFoundPage />
                </Route>
                <Route>
                  <LandingPage />
                </Route>
              </Switch>
            </Router>
          </div>)
}

export default App
