import React from 'react'
import Site from '../Site.jsx'
import CreateTimelineForm from '../CreateTimelineForm.jsx'

const CreateTimelinePage = () => {
  return (<div>
            <Site>
              <h1>Not found</h1>
              The timeline does not exist.
              <CreateTimelineForm/>
              <a href=''>Create</a>
            </Site>
          </div>)
}

export default CreateTimelinePage
