import React from 'react'

import EditingForm from './EditingForm'

const EditArticleUi = ({ article, author, onSave }) => {
  return <EditingForm
    article={article}
    author={author}
    onSave={onSave}
  />
}

export default EditArticleUi
