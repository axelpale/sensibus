import React from 'react'
import { useHistory } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import sensibusApi from 'sensibus-api-client'
import sensibusToken from 'sensibus-token'

const CreateTimelineForm = () => {
  const history = useHistory()

  const onClick = () => {
    // TODO: token validation check, insert token to postTimeline()
    if (sensibusToken.hasToken()) {
      sensibusApi
        .postTimeline()
        .then(obj => window.location.replace(`/t/${obj.timelineId}`))
        .catch(err => {
          console.log(err)
        })
    } else {
      history.push('/signup')
    }
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
