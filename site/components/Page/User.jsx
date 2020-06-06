import React, { useEffect, useState } from 'react'
import Page from './index.jsx'
import { useParams } from 'react-router-dom'
import sensibusApi from 'sensibus-api-client'
import sensibusToken from 'sensibus-token'
import CreateTimelineForm from '../Form/CreateTimeline.jsx'
import { useSelector } from 'react-redux'

const UserPage = () => {
  const { userName } = useParams()

  const [userDetails, setUserDetails] = useState({
    id: null,
    email: null,
    name: null
  })

  // basically this hook is only to cause re-render of component because of
  // redux state update (value is not used anywhere, is this TODO?)
  const loggedIn = useSelector(s => s)

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

  const renderPageData = () => {
    if (userDetails !== null) {
      if (Object.keys(userDetails).length === 0) {
        // user was gotten but was empty -> not found
        return (
          <>
            <h1>User not found</h1>
            User {userName} does not exist
          </>
        )
      } else {
        return (
          <>
            <h1>{userName}</h1>
            E-mail: {userDetails.email}
            {renderLoggedinControls()}
          </>
        )
      }
    } else {
      return (
        <>
          <h1>{userName}</h1>
          Retrieving information...
        </>
      )
    }
  }
  return <Page>{renderPageData()}</Page>
}

export default UserPage
