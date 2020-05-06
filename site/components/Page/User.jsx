import React, { useEffect } from 'react'
import Page from './index.jsx'
import { useParams } from 'react-router-dom'
import sensibusApi from 'sensibus-api-client'

const UserPage = () => {
  let { userId } = useParams()

  useEffect(() => {
    sensibusApi
      .getUser(userId)
      .then((value) => console.log(value))
  }, [])

  return (
      <Page>
        <h1>{userId}</h1>
        user information here
      </Page>
  )
}

export default UserPage
