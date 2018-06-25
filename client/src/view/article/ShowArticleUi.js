import React from 'react'

import FullArticle from './FullArticle'

const ShowArticleUi = ({ article, hasEditPermission, onDelete }) => {
  return <FullArticle
    article={article}
    hasEditPermission={hasEditPermission}
    onDelete={onDelete}
  />
}

export default ShowArticleUi
