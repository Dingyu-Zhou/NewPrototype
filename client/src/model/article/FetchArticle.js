import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

class FetchArticleLogic extends React.Component {
  render () {
    const { loading, error, article } = this.props.data
    return React.cloneElement(this.props.children, {
      appApi: {
        ...this.props.appApi,
        fetchArticle: {
          loading: loading || !article,   // to hack the Apollo always forever bug
          error,
          article
        }
      }
    })
  }
}

const fetchArticleQuery = gql`
  query ($id: ID!) {
    article (id: $id) {
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

const FetchArticle = graphql(fetchArticleQuery, {
  options: ({ articleId }) => ({
    variables: {
      id: articleId
    }
    // fetchPolicy: 'network-only'
  })
})(FetchArticleLogic)

export default FetchArticle
