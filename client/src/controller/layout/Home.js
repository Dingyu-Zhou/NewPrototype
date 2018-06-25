import React from 'react'

import FetchArticleList from '../../model/article/FetchArticleList'
import Error from '../layout/Error'
import Loader from '../layout/Loader'
import HomeUi from '../../view/layout/HomeUi'

const Home = () => {
  const MainLogic = ({ appApi: { fetchArticleList } }) => {
    if (fetchArticleList.loading) {
      return <Loader controller='article' action='fetchList' />
    }
    if (fetchArticleList.error) {
      return <Error controller='article' action='fetchList' error={fetchArticleList.error} />
    }

    return <HomeUi articles={fetchArticleList.articles} />
  }

  return (
    <FetchArticleList>
      <MainLogic />
    </FetchArticleList>
  )
}

export default Home
