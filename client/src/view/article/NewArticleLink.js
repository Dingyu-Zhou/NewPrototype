import React from 'react'
import { Link } from 'react-router-dom'

const NewArticleLink = () => {
  return (
    <div>
      <Link to='/articles/new'>Write a new article</Link>
    </div>
  )
}

export default NewArticleLink
