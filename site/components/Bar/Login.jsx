import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'

const LoginBar = ({}) => {
  const [loginFormVisible, setLoginFormVisible] = useState(false)

  const onClick = () => {
    setLoginFormVisible(!loginFormVisible)
  }

  if (loginFormVisible) {
    return (
      <Navbar bg='dark' variant='dark'>
        <Navbar.Collapse className='justify-content-end'>
          <Form inline>
            <FormControl
              type='text'
              placeholder='Username'
              className='mr-sm-2'
            />
            <FormControl
              type='password'
              placeholder='Password'
              className='mr-sm-2'
            />
            <Button variant='outline-info'>Login</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    )
  }

  return (
    <Navbar bg='dark' variant='dark'>
      <Navbar.Collapse className='justify-content-end'>
        <Button variant='outline-info' onClick={onClick}>
          LOGIN
        </Button>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default LoginBar
