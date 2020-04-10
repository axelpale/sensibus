import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'

import LandingPage from './components/LandingPage.jsx'
import NotFoundPage from './components/NotFoundPage.jsx'
import TimelinePage from './components/TimelinePage.jsx'

const App = () => {
  return (<div>
            <LandingPage />
            <NotFoundPage />
            <TimelinePage />
          </div>)
}

export default App
