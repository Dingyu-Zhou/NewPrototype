import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

class FetchArticleListLogic extends React.Component {
  render () {
    const { loading, error, articles } = this.props.data
    return React.cloneElement(this.props.children, {
      appApi: {
        ...this.props.appApi,
        fetchArticleList: {
          loading: loading || !articles,   // to hack the Apollo always forever bug
          error,
          articles
        }
      }
    })
  }
}

export const fetchArticleListQuery = gql`
  query ($filter: ArticleFilter) {
    articles (filter: $filter) {
      id
      title
      body
      abstract
      createdAt
      updatedAt

      author {
        id
        nickname
        username
      }
    }
  }
`

const FetchArticleList = graphql(fetchArticleListQuery, {
  options: ({ filter }) => ({
    variables: {
      filter
    }
    // fetchPolicy: 'network-only'
  })
})(FetchArticleListLogic)

export default FetchArticleList
