import React from 'react'
import { connect } from 'react-redux'

import FetchArticleList from '../../model/article/FetchArticleList'
import Error from '../layout/Error'
import Loader from '../layout/Loader'
import ShowUserUi from '../../view/user/ShowUserUi'

const ShowUserLogic = ({ match: { params }, user }) => {
  const MainLogic = ({ appApi: { fetchArticleList } }) => {
    if (fetchArticleList.loading) {
      return <Loader controller='article' action='fetchList' />
    }
    if (fetchArticleList.error) {
      return <Error controller='article' action='fetchList' error={fetchArticleList.error} />
    }

    return (
      <ShowUserUi
        user={user.toJS()}
        expectedUsername={params.username}
        articles={fetchArticleList.articles}
      />
    )
  }

  return (
    <FetchArticleList filter={{ authorUsername: params.username }}>
      <MainLogic />
    </FetchArticleList>
  )
}

const mapStateToProps = ({ user }) => ({ user })

const ShowUser = connect(mapStateToProps)(ShowUserLogic)

export default ShowUser
