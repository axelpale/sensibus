import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import SignUpForm from '../Form/SignUp.jsx'
import sensibusApi from 'sensibus-api-client'
import jwtDecode from 'jwt-decode'

const LoginBar = ({}) => {
  // states:
  // 0 - show loginbutton
  // 1 - show loginform
  // 2 - show when waiting for response
  // 3 - show when error (timeout/button to state 0)
  // 4 - show logged in details

  // at the start watch if token is in local storage
  useEffect(() => {
    const lsToken = window.localStorage.getItem('sensibusToken')
    if (lsToken !== null) {
      setUserDetails({ ...userDetails, email: jwtDecode(lsToken).email })
      setLoginState(4)
    }
  }, [])

  const [loginState, setLoginState] = useState(0)
  const [userDetails, setUserDetails] = useState({ email: '', password: '' })

  const onClickShowLogin = e => {
    e.preventDefault()
    setLoginState(1)
  }

  const onClickSendLogin = event => {
    setLoginState(2)
    sensibusApi
      .postLogin(userDetails)
      .then(token => {
        window.localStorage.setItem('sensibusToken', token)
        setLoginState(4)
      })
      .catch(() => setLoginState(3))
  }

  const onClickLogout = () => {
    // remove token from local storage
    window.localStorage.removeItem('sensibusToken')
    setLoginState(0)
  }

  const renderLoginForm = state => {
    if (state == 0) {
      return (
        <>
          <Button variant='outline-info' onClick={onClickShowLogin}>
            Log In
          </Button>
          <SignUpForm />
        </>
      )
    } else if (state == 1) {
      return (
        <Form inline onSubmit={onClickSendLogin}>
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
          <Button variant='outline-info' type='submit'>
            Login
          </Button>
        </Form>
      )
    } else if (state == 2) {
      return <Navbar.Text>Logging in...</Navbar.Text>
    } else if (state == 3) {
      return (
        <Navbar.Text>
          Error{' '}
          <Button variant='outline-info' onClick={() => setLoginState(0)}>
            X
          </Button>
        </Navbar.Text>
      )
    } else if (state == 4)
      return (
        <Navbar.Text>
          {userDetails.email}{' '}
          <Button variant='outline-info' onClick={onClickLogout}>
            Logout
          </Button>
        </Navbar.Text>
      )
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
