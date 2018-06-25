import React from 'react'
import { Link } from 'react-router-dom'
import { Grid, Form, Header } from 'semantic-ui-react'

class RegisterForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      email: '',
      nickname: '',
      password: '',
      repeatPassword: ''
    }

    this.onInputChange = this.onInputChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  render () {
    const { username, email, nickname, password, repeatPassword } = this.state
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
              type='email'
              label='Email'
              name='email'
              value={email}
              placeholder='Email'
              onChange={this.onInputChange}
            />
            <Form.Input
              type='text'
              label='Nickname'
              name='nickname'
              value={nickname}
              placeholder='Nickname'
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
            <Form.Input
              type='password'
              label='Repeat Password'
              name='repeatPassword'
              value={repeatPassword}
              placeholder='Repeat Password'
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
      this.props.onSubmit({
        username: this.state.username,
        email: this.state.email,
        nickname: this.state.nickname,
        password: this.state.password
      })
    }
  }

  validateInput () {
    if (this.state.username.match(/^[a-z0-9A-Z][a-z0-9A-Z_\-.]*[a-z0-9A-Z]$/)) {
      if (this.state.email.match(/\S+@\S+/)) {
        if (this.state.nickname.match(/\S+/)) {
          if (this.state.password.length > 7) {
            if (this.state.password === this.state.repeatPassword) {
              return true
            } else {
              window.alert('The repeat password is different!')
            }
          } else {
            window.alert('Password is invalid!')
          }
        } else {
          window.alert('Nickname is invalid!')
        }
      } else {
        window.alert('Email is invalid!')
      }
    } else {
      window.alert('Username is invalid!')
    }

    return false
  }
}

export default RegisterForm
