import DateType from './custom_scalars/date'
import User from '../models/user'
import Article from '../models/article'

/**
  * This object wraps all GraphQL resolvers.
  * @see http://dev.apollodata.com/tools/graphql-server/
  *
  * @access public
  * @type {object}
  * @property {object} Query Wraps all query resolvers
  * @property {object} Mutation Wraps all mutation resolvers
  */
export const resolvers = {
  Date: DateType,

  Query: {
    articles: async (obj, { filter }) => {
      let articles = []
      if (filter) {
        let hasProperFilter = false
        if (filter.authorUsername) {
          hasProperFilter = true
          const user = await User.findByUsername(filter.authorUsername)

          if (user) {
            articles = await Article.find({ author: user.id }).sort({ _id: -1 }).populate('author')
          } else {
            throw Error('Cannot find the user.')
          }
        }

        if (!hasProperFilter) {
          throw Error('Invalid filter for articles query.')
        }
      } else {
        articles = await Article.find().sort({ _id: -1 }).populate('author')
      }
      return articles
    },

    article: async (obj, { id }) => {
      const article = await Article.findById(id).populate('author')
      return article
    }
  },

  Mutation: {
    createUser: async (obj, { username, email, nickname, password }, context) => {
      const newUser = {
        username: username,
        email: email,
        nickname: nickname,
        password: password
      }
      let user = await User.create(newUser)
      user.jwt = User.generateJwt(user)
      context.user = Promise.resolve(user)
      return user
    },

    authenticateUser: async (obj, { username, password }, context) => {
      const result = await User.authenticate(username, password)
      if (result.isAuthenticated) {
        let user = result.user
        user.jwt = User.generateJwt(user)
        context.user = Promise.resolve(user)
        return user
      } else {
        throw Error(result.failureReason)
      }
    },

    saveArticle: async (obj, { userId, articleId, title, body, bodyText, abstract }) => {
      let articleAbstract
      if (abstract) {
        articleAbstract = abstract.substring(0, 300)
      } else {
        articleAbstract = bodyText.substring(0, 300)   // use first 300 characters as default abstract
      }

      if (articleId) {
        const article = await Article.findById(articleId).populate('author')
        if (article.author.id === userId) {
          article.title = title
          article.body = body
          article.bodyText = bodyText
          article.abstract = articleAbstract
          await article.save()
          return article
        } else {
          throw Error('You are not allowed to change this article.')
        }
      } else {
        const user = await User.findById(userId)
        if (user) {
          const content = { author: user._id, title, body, bodyText, abstract: articleAbstract }
          const newArticle = await Article.create(content)
          newArticle.author = user
          return newArticle
        } else {
          throw Error('The author no longer exists.')
        }
      }
    },

    deleteArticle: async (obj, { id }) => {
      const article = await Article.findById(id).populate('author')
      await article.remove()
      return article
    }
  }
}
