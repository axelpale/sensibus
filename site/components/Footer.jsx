import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import './footer.css'

const Footer = () => {
  return (
    <Container fluid className='bg-primary'>
      <div className='footer-fill bg-primary'>
        <Row className='mt-3 text-white'>
          <Col>
            <footer className='text-center py-3'>
              2020 &copy; Sensibus.io
            </footer>
          </Col>
        </Row>
      </div>
    </Container>
  )
}

export default Footer
