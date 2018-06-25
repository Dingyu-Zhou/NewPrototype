import React from 'react'

import EditingForm from './EditingForm'

const NewArticleUi = ({ author, onSave }) => {
  return <EditingForm
    author={author}
    onSave={onSave}
  />
}

export default NewArticleUi
