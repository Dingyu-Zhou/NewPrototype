import React from 'react'
import { Link } from 'react-router-dom'
import { Grid, Form, Header } from 'semantic-ui-react'

class SignInForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }

    this.onInputChange = this.onInputChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  render () {
    const { username, password } = this.state

    let content = null
    let user = this.props.user
    if (user && user.hasSignedIn === true) {
      content = (
        <div>
          <br /><br />
          <div>
            <Header as='h3'>You have already signed in.</Header>
            <br />
            <div><Link to='/'>Back to the home page.</Link></div>
          </div>
          <br /><br />
        </div>
      )
    } else {
      content = (
        <div>
          <Header as='h3'>Sign In</Header>
          <Form onSubmit={this.onSubmit}>
            <Form.Input
              type='text'
              label='Username'
              name='username'
              value={username}
              placeholder='Username'
              onChange={this.onInputChange}
            />
            <Form.Input
              type='password'
              label='Password'
              name='password'
              value={password}
              placeholder='Password'
              onChange={this.onInputChange}
            />
            <br />
            <Form.Button primary>Submit</Form.Button>
          </Form>
        </div>
      )
    }

    return (
      <Grid columns='equal'>
        <Grid.Column />
        <Grid.Column width={8}>{content}</Grid.Column>
        <Grid.Column />
      </Grid>
    )
  }

  onInputChange (event, { name, value }) {
    this.setState({ [name]: value })
  }

  onSubmit (event) {
    event.preventDefault()
    if (this.validateInput()) {
      this.props.onSubmit(this.state.username, this.state.password)
    }
  }

  validateInput () {
    if (this.state.username.match(/^[a-z0-9A-Z][a-z0-9A-Z_\-.]*[a-z0-9A-Z]$/)) {
      if (this.state.password.length > 7) {
        return true
      } else {
        window.alert('Password is invalid!')
      }
    } else {
      window.alert('Username is invalid!')
    }

    return false
  }
}

export default SignInForm