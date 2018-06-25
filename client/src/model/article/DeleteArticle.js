import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import AppApollo from '../../app_apollo'

class DeleteArticleLogic extends React.Component {
  constructor (props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState () {
    return {
      deleteStatus: null
    }
  }

  componentWillReceiveProps () {
    if (!this.state.deleteStatus || this.state.deleteStatus.error) {
      this.setState(this.getInitialState())
    }
  }

  render () {
    return React.cloneElement(this.props.children, {
      appApi: {
        ...this.props.appApi,
        deleteArticle: {
          onDelete: this.onDelete.bind(this),
          status: this.state.deleteStatus
        }
      }
    })
  }

  async onDelete (article) {
    this.setState({
      deleteStatus: {
        hasFinished: false,
        error: null,
        deletedArticle: null
      }
    })

    try {
      /**
        * @todo need a maturer way to handle Apollo cache.
        */
      await AppApollo.client.resetStore()

      const response = await this.props.deleteArticleMutation({
        variables: {
          id: article.id
        }
      })
      this.setState({
        deleteStatus: {
          hasFinished: true,
          error: null,
          deletedArticle: response.data.deleteArticle
        }
      })
    } catch (error) {
      this.setState({
        deleteStatus: {
          hasFinished: true,
          error: error,
          deletedArticle: null
        }
      })
    }
  }
}

const deleteArticleMutation = gql`
  mutation ($id: ID!) {
    deleteArticle (id: $id) {
      id
    }
  }
`

const DeleteArticle = graphql(deleteArticleMutation, {
  name: 'deleteArticleMutation'
})(DeleteArticleLogic)

export default DeleteArticle
