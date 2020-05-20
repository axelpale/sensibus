import React, { useState, useEffect } from 'react'
import Page from './index.jsx'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'

import CreateTimelineForm from '../Form/CreateTimeline.jsx'
import SignUpForm from '../Form/SignUp.jsx'
import sensibusApi from 'sensibus-api-client'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  const [popular, setPopular] = useState([])
  const [recent, setRecent] = useState([])

  useEffect(() => {
    sensibusApi.getRecentTimelines().then(data => {
      setRecent(data)
    })

    sensibusApi.getPopularTimelines().then(data => {
      setPopular(data)
    })
  }, [])

  // new Date(el.createdAt).toLocaleDateString('en')
  const mapThings = things => {
    // el.id el.title
    return things.map((el, i) => {
      return (
        <ListGroup.Item key={i}>
          <a href={`/t/${el.id}`}>{el.title}</a> by{' '}
          <Link to={`/user/${el.createdBy}`}>{el.createdBy}</Link> at{' '}
          {el.createdAt}
        </ListGroup.Item>
      )
    })
  }

  return (
    <Page>
      <h1>Sensibus.io</h1>
      <CreateTimelineForm />
      <SignUpForm />
      <Row className='mt-3'>
        <Col>
          <h3>Popular timelines</h3>
          <ListGroup>{mapThings(popular)}</ListGroup>
        </Col>
        <Col>
          <h3>New timelines</h3>
          <ListGroup>{mapThings(recent)}</ListGroup>
        </Col>
      </Row>
    </Page>
  )
}

export default LandingPage
