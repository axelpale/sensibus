import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import sensibusApi from 'sensibus-api-client'

const LoginBar = ({}) => {
  // states:
  // 0 - show loginbutton
  // 1 - show loginform
  // 2 - show when waiting for response
  // 3 - show when error (timeout/button to state 0)
  // 4 - show logged in details

  const [loginState, setLoginState] = useState(0)
  const [userDetails, setUserDetails] = useState({ email: '', password: '' })

  const onClickShowLogin = () => {
    setLoginState(1)
  }

  const onClickSendLogin = event => {
    setLoginState(2)
    sensibusApi
      .postLogin(userDetails)
      .then(() => setLoginState(4))
      .catch(() => setLoginState(3))
  }

  const renderLoginForm = state => {
    if (state == 0) {
      return (
        <Button variant='outline-info' onClick={onClickShowLogin}>
          LOGIN
        </Button>
      )
    } else if (state == 1) {
      return (
        <Form inline>
          <FormControl
            type='text'
            placeholder='Username/email'
            className='mr-sm-2'
            onChange={e =>
              setUserDetails({ ...userDetails, email: e.target.value })
            }
          />
          <FormControl
            type='password'
            placeholder='Password'
            className='mr-sm-2'
            onChange={e =>
              setUserDetails({ ...userDetails, password: e.target.value })
            }
          />
          <Button variant='outline-info' onClick={onClickSendLogin}>
            Login
          </Button>
        </Form>
      )
    } else if (state == 2) {
      return <Navbar.Text>Logging in...</Navbar.Text>
    } else if (state == 3) {
      return <Navbar.Text>Error</Navbar.Text>
    } else if (state == 4) return <Navbar.Text> logged in</Navbar.Text>
  }

  return (
    <Navbar bg='dark' variant='dark'>
      <Navbar.Collapse className='justify-content-end'>
        {renderLoginForm(loginState)}
      </Navbar.Collapse>
    </Navbar>
  )
}

export default LoginBar
