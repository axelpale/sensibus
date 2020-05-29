import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import sensibusApi from 'sensibus-api-client'
import sensibusToken from 'sensibus-token'

const LoginForm = ({ setLoginState, checkIfLoggedIn }) => {
  const [loginDetails, setLoginDetails] = useState({ email: '', password: '' })

  const onClickSendLogin = event => {
    setLoginState(2)
    sensibusApi
      .postLogin(loginDetails)
      .then(token => {
        sensibusToken.setToken(token)
        setLoginState(4)
        checkIfLoggedIn()
      })
      .catch(err => {
        setLoginState(3)
      })
  }

  return (
    <Form inline onSubmit={onClickSendLogin}>
      <FormControl
        type='text'
        placeholder='Username/email'
        className='mr-sm-2'
        onChange={e =>
          setLoginDetails({ ...loginDetails, email: e.target.value })
        }
      />
      <FormControl
        type='password'
        placeholder='Password'
        className='mr-sm-2'
        onChange={e =>
          setLoginDetails({ ...loginDetails, password: e.target.value })
        }
      />
      <Button variant='outline-info' type='submit'>
        Login
      </Button>
    </Form>
  )
}

export default LoginForm
