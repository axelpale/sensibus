import React from 'react'
import Page from './index.jsx'
import { Link } from 'react-router-dom'

const SignUpPage = () => {
  return (
    <Page>
      <h1>Sign up</h1>
      Hello.
      <br />
      <Link to='/'>main page</Link>
    </Page>
  )
}

export default SignUpPage
