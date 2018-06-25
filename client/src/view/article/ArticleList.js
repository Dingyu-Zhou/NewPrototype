import React from 'react'
import { Link } from 'react-router-dom'

const ArticleList = ({ articles }) => {
  let content = null

  if (articles && articles.length > 0) {
    content = (
      <div>
        {
          articles.map(article => {
            let authorInfo = null
            if (article.author && article.author.nickname) {
              authorInfo = (
                <div>
                  Author: <Link to={`/${article.author.username}`}>{article.author.nickname}</Link>,
                  <span>&#160;</span>
                  {(new Date(article.updatedAt)).toLocaleDateString()}
                </div>
              )
            }

            return (
              <div key={article.id}>
                <h3>{article.title}</h3>
                {authorInfo}
                <div>{article.abstract} ... <Link to={`/article/${article.id}`}><i>Read the article</i></Link></div>
                <div><hr /><br /></div>
              </div>
            )
          })
        }
      </div>
    )
  } else {
    content = (
      <div>
        <div><br /><hr /><br /></div>
        <div>No article is found.</div>
      </div>
    )
  }

  return content
}

export default ArticleList
