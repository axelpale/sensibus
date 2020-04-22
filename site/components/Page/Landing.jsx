import React from 'react'
import Page from './index.jsx'
import CreateTimelineForm from '../CreateTimelineForm.jsx'

const LandingPage = () => {
  
  return (<Page>
            <h1>Sensibus.io</h1>
            <CreateTimelineForm/>
            <br/>
            or see popular timelines
            <br/>
            or see new timelines
            <br/>
            two columns
          </Page>)
}

export default LandingPage
