import React from 'react'
import Page from './index.jsx'
import CreateTimelineForm from '../Form/CreateTimeline.jsx'

const CreateTimelinePage = () => {
  return (
    <Page>
      <h1>Not found</h1>
      The timeline does not exist.
      <CreateTimelineForm />
      <a href=''>Create</a>
    </Page>
  )
}

export default CreateTimelinePage
