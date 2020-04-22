import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'

import LandingPage from './components/Page/Landing.jsx'
import NotFoundPage from './components/Page/NotFound.jsx'
import CreateTimelinePage from './components/Page/CreateTimeline.jsx'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

const App = () => {
  return (<div>
            <Router>
              <Switch>
                <Route path='/t/:id'>
                  <CreateTimelinePage />
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
