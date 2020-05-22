import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'

const LoginBar = ({}) => {
  const [loginFormVisible, setLoginFormVisible] = useState(false)
  const [userDetails, setUserDetails] = useState({ userName: '', passwd: '' })

  const onClickShowLogin = () => {
    setLoginFormVisible(!loginFormVisible)
  }

  const onClickSendLogin = event => {
    console.log(userDetails)
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
              onChange={e =>
                setUserDetails({ ...userDetails, userName: e.target.value })
              }
            />
            <FormControl
              type='password'
              placeholder='Password'
              className='mr-sm-2'
              onChange={e =>
                setUserDetails({ ...userDetails, passwd: e.target.value })
              }
            />
            <Button variant='outline-info' onClick={onClickSendLogin}>
              Login
            </Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    )
  }

  return (
    <Navbar bg='dark' variant='dark'>
      <Navbar.Collapse className='justify-content-end'>
        <Button variant='outline-info' onClick={onClickShowLogin}>
          LOGIN
        </Button>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default LoginBar
