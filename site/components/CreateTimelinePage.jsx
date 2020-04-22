import React from 'react'
import Site from './Site.jsx'
import CreateTimelineForm from './CreateTimelineForm.jsx'

const CreateTimeline = () => {
  return (<div>
            <h1>Not found</h1>
            <Site>
              The timeline does not exist.
              <CreateTimelineForm/>
              <a href=''>Create</a>
            </Site>
          </div>)
}

export default CreateTimeline
