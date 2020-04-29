import React from 'react'
import Page from './index.jsx'
import { Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import apiService from '../../apiService.js'

const SignUpPage = () => {

  const onSubmit = (event) => {
    event.preventDefault()
    const email = document.getElementById('formBasicEmail').value
    const pwd = document.getElementById('formBasicPassword').value
    const user = document.getElementById('formBasicUser').value

    const account = {username:user, email:email, password:pwd}
    apiService.postAccount(account)
  }

  return (
    <Page>
      <h1>Sign up</h1>
      <Form action='#' method='post' onSubmit={onSubmit}>
        <Form.Group controlId='formBasicEmail'>
          <Form.Label>Email address</Form.Label>
          <Form.Control type='email' placeholder='Enter email' />
        </Form.Group>
        <Form.Group controlId='formBasicPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' placeholder='Password' />
        </Form.Group>
        <Form.Group controlId='formBasicUser'>
          <Form.Label>Username</Form.Label>
          <Form.Control type='text' placeholder='Username' />
        </Form.Group>
        <Button variant='primary' type='submit'>
          Submit
        </Button>
      </Form>
      
      <Link to='/'>main page</Link>
    </Page>
  )
}

export default SignUpPage
