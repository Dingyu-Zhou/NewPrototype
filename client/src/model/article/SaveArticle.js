import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import AppApollo from '../../app_apollo'

class SaveArticleLogic extends React.Component {
  constructor (props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState () {
    return {
      saveStatus: null
    }
  }

  componentWillReceiveProps () {
    if (!this.state.saveStatus || this.state.saveStatus.error) {
      this.setState(this.getInitialState())
    }
  }

  render () {
    return React.cloneElement(this.props.children, {
      appApi: {
        ...this.props.appApi,
        saveArticle: {
          onSave: this.onSave.bind(this),
          status: this.state.saveStatus
        }
      }
    })
  }

  async onSave (article, author) {
    this.setState({
      saveStatus: {
        hasFinished: false,
        error: null,
        savedArticle: null
      }
    })

    try {
      /**
        * @todo need a maturer way to handle Apollo cache.
        */
      await AppApollo.client.resetStore()

      const response = await this.props.saveArticleMutation({
        variables: {
          userId: author.id,
          articleId: article.id,
          title: article.title,
          body: article.body,
          bodyText: article.bodyText
        }
      })
      this.setState({
        saveStatus: {
          hasFinished: true,
          error: null,
          savedArticle: response.data.saveArticle
        }
      })
    } catch (error) {
      this.setState({
        saveStatus: {
          hasFinished: true,
          error: error,
          savedArticle: null
        }
      })
    }
  }
}

const saveArticleMutation = gql`
  mutation ($userId: ID!, $articleId: ID, $title: String!, $body: String!, $bodyText: String!, $abstract: String) {
    saveArticle (userId: $userId, articleId: $articleId, title: $title, body: $body, bodyText: $bodyText, abstract: $abstract) {
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

const SaveArticle = graphql(saveArticleMutation, {
  name: 'saveArticleMutation'
})(SaveArticleLogic)

export default SaveArticle
