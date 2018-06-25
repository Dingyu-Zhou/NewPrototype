import React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import SaveArticle from '../../model/article/SaveArticle'
import Error from '../layout/Error'
import Loader from '../layout/Loader'
import SignInCheck from '../../view/user/SignInCheck'
import NewArticleUi from '../../view/article/NewArticleUi'

const NewArticleLogic = ({ match: { params }, user }) => {
  const MainLogic = ({ appApi: { saveArticle } }) => {
    let content = null
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
      content = <NewArticleUi
        author={user.toJS()}
        onSave={saveArticle.onSave}
      />
    }
    return (
      <SignInCheck user={user.toJS()}>
        {content}
      </SignInCheck>
    )
  }

  return (
    <SaveArticle>
      <MainLogic />
    </SaveArticle>
  )
}

const mapStateToProps = ({ user }) => ({ user })

const NewArticle = connect(mapStateToProps)(NewArticleLogic)

export default NewArticle
