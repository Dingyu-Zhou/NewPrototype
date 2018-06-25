import React from 'react'

import ArticleList from '../article/ArticleList'
import NewArticleLink from '../article/NewArticleLink'

const ShowUserUi = ({ user, expectedUsername, articles }) => {
  let writeArticleLink = null
  if (user && user.hasSignedIn && user.username.toLowerCase() === expectedUsername.toLowerCase()) {
    writeArticleLink = <NewArticleLink />
  }

  return (
    <div>
      {writeArticleLink}
      <br />
      <ArticleList articles={articles} />
    </div>
  )
}

export default ShowUserUi
