import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Footer = () => {
  return (<Row className='mt-3 text-white'>
            <Col>
              <footer className="text-center py-3 bg-primary">
                2020 &copy; Sensibus.io
              </footer>
            </Col>
          </Row>)
}

export default Footer
