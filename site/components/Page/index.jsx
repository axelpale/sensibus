import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FooterBar from '../Bar/Footer.jsx'
import LoginBar from '../Bar/Login.jsx'

const Page = ({ children }) => {
  return (
    <div className='site'>
      <LoginBar />
      <Container>
        <Row>
          <Col>{children}</Col>
        </Row>
      </Container>
      <FooterBar />
    </div>
  )
}

export default Page
