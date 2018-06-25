import React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import FetchArticle from '../../model/article/FetchArticle'
import SaveArticle from '../../model/article/SaveArticle'
import Error from '../layout/Error'
import Loader from '../layout/Loader'
import SignInCheck from '../../view/user/SignInCheck'
import EditArticleUi from '../../view/article/EditArticleUi'

const EditArticleLogic = ({ match: { params }, user }) => {
  const MainLogic = ({ appApi: { fetchArticle, saveArticle } }) => {
    if (fetchArticle.error) {
      return <Error controller='article' action='fetch' error={fetchArticle.error} />
    }
    if (fetchArticle.loading) {
      return <Loader controller='article' action='fetch' />
    }

    let content = null
    if (fetchArticle.article) {
      const saveStatus = saveArticle.status
      if (saveStatus) {
        if (saveStatus.hasFinished) {
          if (saveStatus.error) {
            content = <Error controller='article' action='save' error={saveStatus.error} />
          } else {
            content = <Redirect to={`/article/${saveStatus.savedArticle.id}`} />
          }
        } else {
          content = <Loader controller='article' action='save' />
        }
      } else {
        content = <EditArticleUi
          article={fetchArticle.article}
          author={user.toJS()}
          onSave={saveArticle.onSave}
        />
      }
    } else {
      content = <Error controller='article' action='fetch' />
    }

    return (
      <SignInCheck user={user.toJS()} expectedUserId={fetchArticle.article.author.id}>
        {content}
      </SignInCheck>
    )
  }

  return (
    <FetchArticle articleId={params.id}>
      <SaveArticle>
        <MainLogic />
      </SaveArticle>
    </FetchArticle>
  )
}

const mapStateToProps = ({ user }) => ({ user })

const EditArticle = connect(mapStateToProps)(EditArticleLogic)

export default EditArticle
