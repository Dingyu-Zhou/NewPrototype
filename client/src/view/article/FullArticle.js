import React from 'react'
import { Link } from 'react-router-dom'
import { EditorState, ContentState, convertFromRaw } from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import { Container } from 'semantic-ui-react'

const FullArticle = ({ article, hasEditPermission, onDelete }) => {
  let editorState = null
  try {
    editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(article.body)))
  } catch (e) {
    editorState = EditorState.createWithContent(ContentState.createFromText(article.body))
  }

  let authorInfo = null
  if (article.author && article.author.nickname) {
    authorInfo = <div>Author: <Link to={`/${article.author.username}`}>{article.author.nickname}</Link></div>
  }

  let timeInfo = null
  let createdTime = new Date(article.createdAt)
  let updatedTime = new Date(article.updatedAt)
  if (article.updatedAt - 86400000 > article.createdAt || createdTime.getDate() !== updatedTime.getDate()) {
    timeInfo = (
      <div>
        <div>Originally Written At: {createdTime.toLocaleDateString()}</div>
        <div>Latest Update: {updatedTime.toLocaleDateString()}</div>
      </div>
    )
  } else {
    timeInfo = (
      <div>
        <div>Written At: {createdTime.toLocaleDateString()}</div>
      </div>
    )
  }

  let articleEditDiv = null
  if (hasEditPermission) {
    articleEditDiv = (
      <div>
        <br /><br /><br />
        <div><Link to={`/article/${article.id}/edit`}>Edit the article</Link></div>
        <br />
        <div><Link to='#' onClick={(event) => onDelete(event, article)}>Delete the article</Link></div>
      </div>
    )
  }

  return (
    <Container text textAlign='justified'>
      <h2>{ article.title }</h2>
      {authorInfo}
      <br />
      {timeInfo}
      <br />
      <div>
        <Editor readOnly editorState={editorState} onChange={() => {}} />
      </div>
      {articleEditDiv}
    </Container>
  )
}

export default FullArticle
