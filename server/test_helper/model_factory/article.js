import casual from 'casual'

import factory from 'factory-girl'
import Article from '../../src/models/article'
import User from '../../src/models/user'

factory.define(Article.modelName, Article, () => {
  return {
    author: factory.assoc(User.modelName, 'id'),
    title: casual.title,
    body: casual.text,
    bodyText: casual.text,
    abstract: casual.text
  }
})
