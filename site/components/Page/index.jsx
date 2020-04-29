import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Footer from '../Footer.jsx'

const Page = ({ children }) => {
  return (
    <div className='site'>
      <Container>
        <Row>
          <Col>{children}</Col>
        </Row>
        <Footer />
      </Container>
    </div>
  )
}

export default Page
