import casual from 'casual'
import { mockServer } from 'graphql-tools'
import factory from 'factory-girl'

import { schema } from './schema'
import User, { USER_LOGIN_SETTINGS, USER_LOGIN_FAILURE_REASONS } from '../models/user'
import Article from '../models/article'

/** @test {schema} */
describe('test all GraphQL query schema', () => {
  let mockTestServer = null

  beforeAll(() => {
    mockTestServer = mockServer(schema, {}, true)
  })

  /** @test {schema} */
  test('{ Query: articles } should return all articles from database descendingly if no filter passed', async () => {
    const queryStr = `
      {
        articles {
          id
          title
          body
        }
      }
    `

    // should return an empty array if there is no article in the database
    await Article.deleteMany()
    let queryResult = await mockTestServer.query(queryStr)
    let queriedArticles = queryResult.data.articles
    expect(queriedArticles).toBeInstanceOf(Array)
    expect(queriedArticles.length).toBe(0)

    // the query result should be in the descending order
    let mockArticle1 = await factory.create(Article.modelName)
    let mockArticle2 = await factory.create(Article.modelName)
    queryResult = await mockTestServer.query(queryStr)
    queriedArticles = queryResult.data.articles
    expect(queriedArticles[0].id).toBe(mockArticle2.id)
    expect(queriedArticles[0].title).toBe(mockArticle2.title)
    expect(queriedArticles[0].body).toBe(mockArticle2.body)
    expect(queriedArticles[1].id).toBe(mockArticle1.id)
    expect(queriedArticles[1].title).toBe(mockArticle1.title)
    expect(queriedArticles[1].body).toBe(mockArticle1.body)
  })

  /** @test {schema} */
  test('{ Query: articles } could only return all articles from one author descendingly', async () => {
    const queryStr = `
      query ($filter: ArticleFilter) {
        articles (filter: $filter) {
          id
          title
          body
    
          author {
            id
          }
        }
      }
    `

    await Article.deleteMany()
    const mockUser1 = await factory.create(User.modelName)
    const mockUser2 = await factory.create(User.modelName)
    const mockArticle1 = await factory.create(Article.modelName, { author: mockUser1.id })
    const mockArticle2 = await factory.create(Article.modelName, { author: mockUser1.id })
    await factory.create(Article.modelName, { author: mockUser2.id })

    const queryVars = {
      filter: {
        authorUsername: mockUser1.username
      }
    }

    const queryResult = await mockTestServer.query(queryStr, queryVars)
    const queriedArticles = queryResult.data.articles
    expect(queriedArticles.length).toBe(2)
    expect(queriedArticles[0].id).toBe(mockArticle2.id)
    expect(queriedArticles[0].title).toBe(mockArticle2.title)
    expect(queriedArticles[0].body).toBe(mockArticle2.body)
    expect(queriedArticles[0].author.id).toBe(mockUser1.id.toString())
    expect(queriedArticles[1].id).toBe(mockArticle1.id)
    expect(queriedArticles[1].title).toBe(mockArticle1.title)
    expect(queriedArticles[1].body).toBe(mockArticle1.body)
    expect(queriedArticles[1].author.id).toBe(mockUser1.id.toString())
  })

  /** @test {schema} */
  test('{ Query: articles } should handle exception properly', async () => {
    const queryStr = `
      query ($filter: ArticleFilter) {
        articles (filter: $filter) {
          id
          title
          body
    
          author {
            id
          }
        }
      }
    `

    // invalid filter
    let queryVars = {
      filter: {
        authorUsername: null
      }
    }
    let queryResult = await mockTestServer.query(queryStr, queryVars)
    expect(queryResult.errors).toBeTruthy()
    expect(queryResult.errors.toString()).toMatch(new RegExp('Invalid filter for articles query.'))

    // invalid username
    queryVars = {
      filter: {
        authorUsername: ['invalid_', casual.username].join('')
      }
    }
    queryResult = await mockTestServer.query(queryStr, queryVars)
    expect(queryResult.errors).toBeTruthy()
    expect(queryResult.errors.toString()).toMatch(new RegExp('Cannot find the user.'))
  })

  /** @test {schema} */
  test('{ Query: article } should find the article by the article id, and return it', async () => {
    const mockArticle = await factory.create(Article.modelName)

    const queryStr = `
    query ($id: ID!) {
      article (id: $id) {
          id
          title
          body
        }
      }
    `
    const queryVars = {
      id: mockArticle.id
    }

    let queryResult = await mockTestServer.query(queryStr, queryVars)
    let queriedArticle = queryResult.data.article
    expect(queriedArticle.id).toEqual(mockArticle.id)
    expect(queriedArticle.title).toEqual(mockArticle.title)
    expect(queriedArticle.body).toEqual(mockArticle.body)
  })
})

/** @test {schema} */
describe('test all GraphQL mutation schema', () => {
  let mockTestServer = null

  beforeAll(() => {
    mockTestServer = mockServer(schema, {}, true)
  })

  /** @test {schema} */
  test('{ Mutation: createUser } should create a new user in the database', async () => {
    const mutationStr = `
      mutation ($username: String!, $email: String!, $nickname: String!, $password: String!) {
        createUser(username: $username, email: $email, nickname: $nickname, password: $password) {
          id
          jwt
          username
          nickname
        }
      }
    `

    const mutationVars = {
      username: casual.username,
      email: casual.email,
      nickname: casual.name,
      password: casual.password
    }

    const oldUserCount = await User.count()
    const mutationResult = await mockTestServer.query(mutationStr, mutationVars)
    const currentUserCount = await User.count()
    expect(currentUserCount - oldUserCount).toBe(1)

    const newUser = mutationResult.data.createUser
    expect(newUser.id).toBeTruthy()
    const expectedJwt = User.generateJwt(newUser)
    expect(newUser.jwt).toEqual(expectedJwt)
    expect(newUser.username).toEqual(mutationVars.username.toLowerCase())
    expect(newUser.email).toBeFalsy()   // "email" is not in the query return list
    expect(newUser.nickname).toEqual(mutationVars.nickname)

    const user = await User.findOne({ _id: newUser.id })
    expect(newUser.password).not.toEqual(mutationVars.password)
    const isCorrectPassword = await user.comparePassword(mutationVars.password)
    expect(isCorrectPassword).toBe(true)
  })

  /** @test {schema} */
  test('{ Mutation: authenticateUser } should sign in a user', async () => {
    const password = casual.password
    const mockUser = await factory.create(User.modelName, { password: password })

    const mutationStr = `
      mutation ($username: String!, $password: String!) {
        authenticateUser(username: $username, password: $password) {
          id
          jwt
          username
          nickname
        }
      }
    `

    const mutationVars = {
      username: mockUser.username,
      password: password
    }

    const mutationResult = await mockTestServer.query(mutationStr, mutationVars)
    const signedInUser = mutationResult.data.authenticateUser
    expect(signedInUser.id).toEqual(mockUser.id)
    const expectedJwt = User.generateJwt(mockUser)
    expect(signedInUser.jwt).toEqual(expectedJwt)
    expect(signedInUser.username).toEqual(mockUser.username)
    expect(signedInUser.nickname).toEqual(mockUser.nickname)
  })

  /** @test {schema} */
  test('{ Mutation: authenticateUser } should throw the failure reason if the sign in failed.', async () => {
    const password = casual.password
    const mockUser = await factory.create(User.modelName, { password: password })

    const mutationStr = `
      mutation ($username: String!, $password: String!) {
        authenticateUser(username: $username, password: $password) {
          id
          jwt
          username
          nickname
        }
      }
    `

    // wrong username
    let mutationVars = {
      username: `wrong ${mockUser.username}`,
      password: password
    }
    let mutationResult = await mockTestServer.query(mutationStr, mutationVars)
    expect(mutationResult.errors).toBeTruthy()
    expect(mutationResult.errors.toString()).toMatch(new RegExp(USER_LOGIN_FAILURE_REASONS.NOT_FOUND))

    // wrong password
    mutationVars = {
      username: mockUser.username,
      password: `wrong ${password}`
    }
    mutationResult = await mockTestServer.query(mutationStr, mutationVars)
    expect(mutationResult.errors).toBeTruthy()
    expect(mutationResult.errors.toString()).toMatch(new RegExp(USER_LOGIN_FAILURE_REASONS.PASSWORD_INCORRECT))

    // too many attempts
    for (let ii = 0; ii < USER_LOGIN_SETTINGS.MAX_LOGIN_ATTEMPTS; ++ii) {
      mutationResult = await mockTestServer.query(mutationStr, mutationVars)
    }
    expect(mutationResult.errors).toBeTruthy()
    expect(mutationResult.errors.toString()).toMatch(new RegExp(USER_LOGIN_FAILURE_REASONS.MAX_ATTEMPTS))
  })

  /** @test {schema} */
  test('{ Mutation: saveArticle } should create an article if no articleId passed', async () => {
    const mutationStr = `
      mutation ($userId: ID!, $articleId: ID, $title: String!, $body: String!, $bodyText: String!, $abstract: String) {
        saveArticle (userId: $userId, articleId: $articleId, title: $title, body: $body, bodyText: $bodyText, abstract: $abstract) {
          id
          title
          body
          abstract

          author {
            id
          }
        }
      }
    `

    const mockUser = await factory.create(User.modelName)
    const mutationVars = {
      userId: mockUser.id,
      title: casual.title,
      body: casual.text,
      bodyText: casual.text,
      abstract: casual.text
    }

    const oldArticleCount = await Article.count()
    const mutationResult = await mockTestServer.query(mutationStr, mutationVars)
    const currentArticleCount = await Article.count()
    expect(currentArticleCount - oldArticleCount).toBe(1)

    const createdArticle = mutationResult.data.saveArticle
    expect(createdArticle.id).toBeTruthy()
    expect(createdArticle.title).toBe(mutationVars.title)
    expect(createdArticle.body).toBe(mutationVars.body)
    expect(createdArticle.abstract).toBe(mutationVars.abstract.substring(0, 300))
    expect(createdArticle.author.id).toBe(mockUser.id)
  })

  /** @test {schema} */
  test('{ Mutation: saveArticle } should update an article if an articleId passed', async () => {
    const mockArticle = await factory.create(Article.modelName)

    const mutationStr = `
      mutation ($userId: ID!, $articleId: ID, $title: String!, $body: String!, $bodyText: String!, $abstract: String) {
        saveArticle (userId: $userId, articleId: $articleId, title: $title, body: $body, bodyText: $bodyText, abstract: $abstract) {
          id
          title
          body
          abstract

          author {
            id
          }
        }
      }
    `

    const mutationVars = {
      articleId: mockArticle.id,
      userId: mockArticle.author,
      title: casual.title,
      body: mockArticle.body,
      bodyText: mockArticle.bodyText,
      abstract: mockArticle.abstract
    }

    const oldArticleCount = await Article.count()
    const mutationResult = await mockTestServer.query(mutationStr, mutationVars)
    const currentArticleCount = await Article.count()
    expect(currentArticleCount - oldArticleCount).toBe(0)

    const updatedArticle = mutationResult.data.saveArticle
    expect(updatedArticle.id).toBe(mockArticle.id)
    expect(updatedArticle.title).toBe(mutationVars.title)
    expect(updatedArticle.body).toBe(mockArticle.body)
    expect(updatedArticle.abstract).toBe(mockArticle.abstract.substring(0, 300))
    expect(updatedArticle.author.id).toBe(mockArticle.author.toString())
  })

  /** @test {schema} */
  test('{ Mutation: saveArticle } could automatically generate article abstract', async () => {
    const mutationStr = `
      mutation ($userId: ID!, $articleId: ID, $title: String!, $body: String!, $bodyText: String!, $abstract: String) {
        saveArticle (userId: $userId, articleId: $articleId, title: $title, body: $body, bodyText: $bodyText, abstract: $abstract) {
          id
          title
          body
          abstract

          author {
            id
          }
        }
      }
    `

    // create an article
    const mockUser = await factory.create(User.modelName)
    let mutationVars = {
      userId: mockUser.id,
      title: casual.title,
      body: casual.text,
      bodyText: casual.text
    }
    let mutationResult = await mockTestServer.query(mutationStr, mutationVars)
    const createdArticle = mutationResult.data.saveArticle
    expect(createdArticle.abstract).toBe(mutationVars.bodyText.substring(0, 300))

    // update an article
    mutationVars = {
      articleId: createdArticle.id,
      userId: mockUser.id,
      title: createdArticle.title,
      body: createdArticle.body,
      bodyText: casual.text
    }
    mutationResult = await mockTestServer.query(mutationStr, mutationVars)
    const updatedArticle = mutationResult.data.saveArticle
    expect(updatedArticle.abstract).toBe(mutationVars.bodyText.substring(0, 300))
    expect(updatedArticle.abstract).not.toBe(createdArticle.abstract)
  })

  /** @test {schema} */
  test('{ Mutation: saveArticle } should handle exception properly', async () => {
    const mutationStr = `
      mutation ($userId: ID!, $articleId: ID, $title: String!, $body: String!, $bodyText: String!, $abstract: String) {
        saveArticle (userId: $userId, articleId: $articleId, title: $title, body: $body, bodyText: $bodyText, abstract: $abstract) {
          id
          title
          body
          abstract

          author {
            id
          }
        }
      }
    `

    // create an article with an invalid userId
    const mockArticle = await factory.create(Article.modelName)
    let mutationVars = {
      userId: mockArticle.id,   // pass an article id to userId, should be invalid
      title: casual.title,
      body: casual.text,
      bodyText: casual.text
    }
    let mutationResult = await mockTestServer.query(mutationStr, mutationVars)
    expect(mutationResult.errors).toBeTruthy()
    expect(mutationResult.errors.toString()).toMatch(new RegExp('The author no longer exists.'))

    // update an article, and article.author.id === userId
    mutationVars = {
      articleId: mockArticle.id,
      userId: mockArticle.id,   // pass an article id to userId, should be invalid
      title: casual.title,
      body: casual.text,
      bodyText: casual.text
    }
    mutationResult = await mockTestServer.query(mutationStr, mutationVars)
    expect(mutationResult.errors).toBeTruthy()
    expect(mutationResult.errors.toString()).toMatch(new RegExp('You are not allowed to change this article.'))
  })

  /** @test {schema} */
  test('{ Mutation: deleteArticle } should delete an article', async () => {
    const mockArticle = await factory.create(Article.modelName)
    let article = await Article.findById(mockArticle.id)
    expect(article).toBeTruthy()

    const mutationStr = `
      mutation ($id: ID!) {
        deleteArticle(id: $id) {
          id
          title
          body

          author {
            id
          }
        }
      }
    `

    const mutationVars = {
      id: mockArticle.id
    }

    const mutationResult = await mockTestServer.query(mutationStr, mutationVars)
    article = await Article.findById(mockArticle.id)
    expect(article).toBeFalsy()   // the article should be deleted

    const deletedArticle = mutationResult.data.deleteArticle
    expect(deletedArticle.id).toEqual(mockArticle.id)
    expect(deletedArticle.title).toEqual(mockArticle.title)
    expect(deletedArticle.body).toEqual(mockArticle.body)

    const author = await User.findById(mockArticle.author)
    expect(author).toBeTruthy()   // the author shouldn't be deleted
    expect(deletedArticle.author.id).toBe(author.id)
  })
})
