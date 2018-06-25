import React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import FetchArticle from '../../model/article/FetchArticle'
import DeleteArticle from '../../model/article/DeleteArticle'
import Error from '../layout/Error'
import Loader from '../layout/Loader'
import ShowArticleUi from '../../view/article/ShowArticleUi'

const ShowArticleLogic = ({ match: { params }, user }) => {
  const MainLogic = ({ appApi: { fetchArticle, deleteArticle } }) => {
    const onDelete = (event, article) => {
      event.preventDefault()
      deleteArticle.onDelete(article)
    }

    const renderUi = () => {
      if (fetchArticle.error) {
        return <Error controller='article' action='fetch' error={fetchArticle.error} />
      }
      if (fetchArticle.loading) {
        return <Loader controller='article' action='fetch' />
      }

      const deleteStatus = deleteArticle.status
      if (deleteStatus) {
        if (deleteStatus.hasFinished) {
          if (deleteStatus.error) {
            return <Error controller='article' action='delete' error={deleteStatus.error} />
          } else {
            return <Redirect to={`/${user.get('username')}`} />
          }
        } else {
          return <Loader controller='article' action='delete' />
        }
      }

      const article = fetchArticle.article

      return (
        <ShowArticleUi
          article={fetchArticle.article}
          hasEditPermission={user.get('id') === article.author.id}
          onDelete={onDelete}
        />
      )
    }

    return renderUi()
  }

  return (
    <FetchArticle articleId={params.id}>
      <DeleteArticle>
        <MainLogic />
      </DeleteArticle>
    </FetchArticle>
  )
}

const mapStateToProps = ({ user }) => ({ user })

const ShowArticle = connect(mapStateToProps)(ShowArticleLogic)

export default ShowArticle
