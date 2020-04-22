import React from 'react'
import Site from '../Site.jsx'
import {Link} from 'react-router-dom'

const NotFoundPage = () => {
  return (<div>
            <Site>
              <h1>Not found</h1>
              The page does not exist.
              <br/>
              <Link to={'/'}>main page</Link>
            </Site>
          </div>)
}

export default NotFoundPage
