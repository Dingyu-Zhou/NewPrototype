import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Grid, Header, Divider } from 'semantic-ui-react'

const HeaderUi = ({ user, onUserSignOut }) => {
  const onUserSignOutWrapper = (event) => {
    event.preventDefault()
    onUserSignOut()
  }

  let userContent = null

  if (user && user.hasSignedIn === true) {
    userContent = (
      <Grid columns={2}>
        <Grid.Column>
          Hi <Link to={`/${user.username}`}>{user.nickname}</Link>!
        </Grid.Column>
        <Grid.Column textAlign='right'>
          <Link to='#' onClick={event => onUserSignOutWrapper(event)}>Sign Out</Link>
        </Grid.Column>
      </Grid>
    )
  } else {
    userContent = (
      <Grid columns={2}>
        <Grid.Column>
          Welcome!
        </Grid.Column>
        <Grid.Column textAlign='right'>
          <span>
            <Link to='/users/signIn'>Sign In</Link>
            <span> &#160; &#160; &#160; </span>
            <Link to='/users/signUp'>Sign Up</Link>
          </span>
        </Grid.Column>
      </Grid>
    )
  }

  return (
    <div>
      { userContent }
      <Header as='h2'><Link to='/'>Namo Wisdom</Link></Header>
      <Divider /><br />
    </div>
  )
}

HeaderUi.propTypes = {
  user: PropTypes.object.isRequired,
  onUserSignOut: PropTypes.func.isRequired
}

export default HeaderUi