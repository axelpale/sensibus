import React from 'react'
import Site from './Site.jsx'
import CreateTimelineForm from './CreateTimelineForm.jsx'

const LandingPage = () => {
  
  return (<div>
            <h1>Sensibus.io</h1>
            <Site>
              <CreateTimelineForm/>
              <br/>
              or see popular timelines
              <br/>
              or see new timelines
              <br/>
              two columns
            </Site>
          </div>)
}

export default LandingPage
