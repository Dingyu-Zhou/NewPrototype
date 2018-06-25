import factory from 'factory-girl'

import Article from './article'

/** @test {Article} */
describe('test the model: Article', () => {
  /** @test {Article} */
  test('the saved article should have correct fields', async () => {
    const testArticle = await factory.attrs(Article.modelName)
    const savedArticle = await Article.create(testArticle)
    expect(savedArticle.id).toBeTruthy()
    expect(savedArticle.createdAt).toBeTruthy()
    expect(savedArticle.updatedAt).toBeTruthy()
    expect(savedArticle.author.toString()).toBe(testArticle.author)
    expect(savedArticle.title).toBe(testArticle.title)
    expect(savedArticle.body).toBe(testArticle.body)
    expect(savedArticle.bodyText).toBe(testArticle.bodyText)
    expect(savedArticle.abstract).toBe(testArticle.abstract)
  })

  /** @test {Article} */
  test('the article title is required', async () => {
    try {
      let testArticle = await factory.attrs(Article.modelName)
      testArticle.title = null
      const savedArticle = await Article.create(testArticle)
      expect(savedArticle).toBe('the article should not be saved if the "title" is missing')
    } catch (error) {
      expect(error.toString()).toMatch(/title.* is required/)
    }
  })

  /** @test {Article} */
  test('the article body is required', async () => {
    try {
      let testArticle = await factory.attrs(Article.modelName)
      testArticle.body = null
      const savedArticle = await Article.create(testArticle)
      expect(savedArticle).toBe('the article should not be saved if the "body" is missing')
    } catch (error) {
      expect(error.toString()).toMatch(/body.* is required/)
    }
  })

  /** @test {Article} */
  test('the article bodyText is required', async () => {
    try {
      let testArticle = await factory.attrs(Article.modelName)
      testArticle.bodyText = null
      const savedArticle = await Article.create(testArticle)
      expect(savedArticle).toBe('the article should not be saved if the "bodyText" is missing')
    } catch (error) {
      expect(error.toString()).toMatch(/bodyText.* is required/)
    }
  })

  /** @test {Article} */
  test('the article abstract is required', async () => {
    try {
      let testArticle = await factory.attrs(Article.modelName)
      testArticle.abstract = null
      const savedArticle = await Article.create(testArticle)
      expect(savedArticle).toBe('the article should not be saved if the "abstract" is missing')
    } catch (error) {
      expect(error.toString()).toMatch(/abstract.* is required/)
    }
  })
})
