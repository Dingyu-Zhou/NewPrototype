import React from 'react'
import Editor from 'draft-js-plugins-editor'
import { EditorState, ContentState, convertToRaw, convertFromRaw } from 'draft-js'
import { Container, Button } from 'semantic-ui-react'
import { Map } from 'immutable'

export default class EditingForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = this.getInitialState(props)

    this.onTitleChange = this.onTitleChange.bind(this)
    this.onBodyChange = this.onBodyChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.setState(this.getInitialState(nextProps))
  }

  getInitialState (props) {
    const article = props.article
    let id = null
    let titleState = EditorState.createEmpty()
    let bodyState = EditorState.createEmpty()
    if (article) {
      id = article.id || null
      titleState = EditorState.createWithContent(ContentState.createFromText(article.title))
      try {
        bodyState = EditorState.createWithContent(convertFromRaw(JSON.parse(article.body)))
      } catch (e) {
        bodyState = EditorState.createWithContent(ContentState.createFromText(article.body))
      }
    }
    return { id, titleState, bodyState }
  }

  onTitleChange (newTitleEditorState) {
    this.setState({ titleState: newTitleEditorState })
  }

  onBodyChange (newBodyEditorState) {
    this.setState({ bodyState: newBodyEditorState })
  }

  onSubmit (event) {
    event.preventDefault()

    const articleTitle = this.state.titleState.getCurrentContent().getPlainText()
    const articleContent = this.state.bodyState.getCurrentContent()
    if (articleTitle.length > 0 && articleContent.hasText()) {
      const article = {
        id: this.state.id,
        title: articleTitle,
        body: JSON.stringify(convertToRaw(articleContent)),
        bodyText: articleContent.getPlainText()
      }
      this.props.onSave(article, this.props.author)
    } else {
      window.alert('The article title and body should both have values.')
    }
  }

  render () {
    const graySmallFontStyle = { color: 'gray', fontSize: 'small', fontStyle: 'italic' }
    const noContentStyle = { backgroundColor: 'lightgray' }
    const withContentStyle = { backgroundColor: '' }
    const { titleState, bodyState } = this.state
    const hasTitleContent = titleState.getCurrentContent().hasText()
    const hasBodyContent = bodyState.getCurrentContent().hasText()

    return (
      <Container text textAlign='justified'>
        <div style={graySmallFontStyle}>Article Editing ...</div>
        <br />

        {hasTitleContent ? null : <div style={graySmallFontStyle}>Article Title</div>}
        <div style={hasTitleContent ? withContentStyle : noContentStyle}>
          <Editor
            editorState={titleState}
            onChange={this.onTitleChange}
            blockRenderMap={Map({ 'unstyled': { element: 'h2' } })}
            handleReturn={(e) => { e.preventDefault() }}
          />
        </div>
        <br />

        {hasBodyContent ? null : <div style={graySmallFontStyle}>Article Body</div>}
        <div style={hasBodyContent ? withContentStyle : noContentStyle}>
          <Editor
            editorState={bodyState}
            onChange={this.onBodyChange}
          />
        </div>
        <br /><br />

        <Button primary onClick={this.onSubmit}>Save</Button>
        <br /><br />
      </Container>
    )
  }
}
