import React, { useEffect, useState } from 'react'
import Page from './index.jsx'
import { useParams } from 'react-router-dom'
import sensibusApi from 'sensibus-api-client'
import sensibusToken from 'sensibus-token'
import CreateTimelineForm from '../Form/CreateTimeline.jsx'

const UserPage = () => {
  const { userName } = useParams()

  const [userDetails, setUserDetails] = useState({
    id: null,
    email: null,
    name: null
  })

  useEffect(() => {
    sensibusApi
      .getUser(userName)
      .then(value => setUserDetails(value))
      .catch(err => {
        setUserDetails({})
      })
  }, [])

  const renderLoggedinControls = () => {
    if (
      sensibusToken.hasToken() &&
      sensibusToken.getUser().id == userDetails.id
    ) {
      return <CreateTimelineForm />
    }
  }

  if (userDetails !== null) {
    if (Object.keys(userDetails).length === 0) {
      // user was gotten but was empty -> not found
      return (
        <Page>
          <h1>User not found</h1>
          User {userName} does not exist
        </Page>
      )
    } else {
      return (
        <Page>
          <h1>{userName}</h1>
          E-mail: {userDetails.email}
          {renderLoggedinControls()}
        </Page>
      )
    }
  } else {
    return (
      <Page>
        <h1>{userName}</h1>
        Retrieving information...
      </Page>
    )
  }
}

export default UserPage
