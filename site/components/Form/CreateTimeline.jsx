import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import sensibusApi from 'sensibus-api-client'

const CreateTimelineForm = () => {
  const onClick = () => {
    sensibusApi
      .postTimeline()
      .then(obj => window.location.replace(`/t/${obj.timelineId}`))
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <Form>
      <Button variant='primary' onClick={onClick}>
        Create new timeline
      </Button>
    </Form>
  )
}

export default CreateTimelineForm
