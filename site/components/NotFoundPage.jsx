import React from 'react'
import Site from './Site.jsx'

const NotFoundPage = () => {
  return (<div>
            <h1>Not found</h1>
            <Site>
              The requested timeline does not exist.
              <a href=''>Create</a>
            </Site>
          </div>)
}

export default NotFoundPage
