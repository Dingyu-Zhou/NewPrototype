import React from 'react'
import { connect } from 'react-redux'

import CookieHelper from '../../helper/cookie_helper'
import HeaderUi from '../../view/layout/HeaderUi'

const HeaderLogic = ({ user, onUserSignOut }) => {
  return <HeaderUi user={user.toJS()} onUserSignOut={onUserSignOut} />
}

const mapStateToProps = ({ user }) => ({ user })

const mapDispatchToProps = (dispatch) => {
  return {
    onUserSignOut: () => {
      CookieHelper.userSignOut()
    }
  }
}

const Header = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderLogic)

export default Header
