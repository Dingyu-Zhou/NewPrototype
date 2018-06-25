import mongoose from 'mongoose'

import User from './user'

const MODEL_NAME = 'Article'

let articleSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: User.modelName },
  title: { type: String, required: true },
  body: { type: String, required: true },
  bodyText: { type: String, required: true },   // for text search
  abstract: { type: String, required: true }
}, {
  timestamps: true,
  validateBeforeSave: true
})

const Article = mongoose.model(MODEL_NAME, articleSchema)

/**
  * This is the constructor function for the Mongoose model: Article
  *
  * @access public
  * @type {function}
  */
export default Article
