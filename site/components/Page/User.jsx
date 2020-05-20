import React, { useEffect, useState } from 'react'
import Page from './index.jsx'
import { useParams } from 'react-router-dom'
import sensibusApi from 'sensibus-api-client'

const UserPage = () => {
  const { userId } = useParams()

  const [userDetails, setUserDetails] = useState(null)

  useEffect(() => {
    sensibusApi
      .getUser(userId)
      .then(value => setUserDetails(value))
      .catch(err => {
        setUserDetails({})
      })
  }, [])

  if (userDetails !== null) {
    if (Object.keys(userDetails).length === 0) {
      // user was gotten but was empty -> not found
      return (
        <Page>
          <h1>User not found</h1>
          User {userId} does not exist
        </Page>
      )
    } else {
      return (
        <Page>
          <h1>{userId}</h1>
          E-mail: {userDetails.email}
        </Page>
      )
    }
  } else {
    return (
      <Page>
        <h1>{userId}</h1>
        Retrieving information...
      </Page>
    )
  }
}

export default UserPage
