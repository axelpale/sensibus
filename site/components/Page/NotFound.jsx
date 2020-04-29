import React from 'react'
import Page from './index.jsx'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <Page>
      <h1>Not found</h1>
      The page does not exist.
      <br />
      <Link to='/'>main page</Link>
    </Page>
  )
}

export default NotFoundPage
