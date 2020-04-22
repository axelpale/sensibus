import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const CreateTimelineForm = () => {

  return(<Form action='/t' method='post'>
           <Button variant="primary" type="submit">
             Create new timeline
           </Button>
         </Form>
        )
}

export default CreateTimelineForm
