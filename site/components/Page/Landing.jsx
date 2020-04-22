import React, {useState, useEffect} from 'react'
import Page from './index.jsx'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import CreateTimelineForm from '../CreateTimelineForm.jsx'
import apiService from '../../apiService.js'

const LandingPage = () => {

  const [popular, setPopular] = useState([])
  const [recent, setRecent] = useState([])

  useEffect(() => {
    apiService
      .getRecentTimelines()
      .then(data=>{setRecent(data)})

    apiService
      .getPopularTimelines()
      .then(data=>{setPopular(data)})
  }, [])
  
  const mapThings = (things) => {
    // el.id el.title
    return things.map((el, i)=>{return (<div key={i}><a href={`/t/${el.id}`} >{el.title}</a></div>)})
  }

  return (<Page>
            <h1>Sensibus.io</h1>
            <CreateTimelineForm/>
            <Row className='mt-3'>
              <Col>
                <h3>Popular timelines</h3>
                {mapThings(popular)}
              </Col>
              <Col>
                <h3>New timelines</h3>
                {mapThings(recent)}
              </Col>
            </Row>
          </Page>)
}

export default LandingPage
