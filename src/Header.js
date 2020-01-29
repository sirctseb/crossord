import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirebase } from 'react-redux-firebase';
import { withRouter } from 'react-router-dom';
import FirebaseAuth from 'react-firebaseui/FirebaseAuth';

import firebaseAuthConfig from '../config/firebaseAuth';

const Header = ({ auth, firebase, history }) => {
  const [showLogin, setShowLogin] = useState(false);

  const handleShowLogin = () => {
    setShowLogin(true);
  };

  const handleHideLogin = () => {
    setShowLogin(false);
  };

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  const handleNew = () => {
    const fbRef = firebase.ref();
    const cwRef = fbRef.push();
    fbRef.update({
      [`crosswords/${cwRef.key}`]: { rows: 15, symmetric: true, title: 'untitled' },
      [`users/${auth.uid}/crosswords/${cwRef.key}`]: {
        title: 'Untitled',
      },
      [`permissions/${cwRef.key}`]: { owner: auth.uid },
    }).then(() => history.push(`/${cwRef.key}`));
  };

  return (
    <header className='header'>
      <h1 className='header__heading'>
        Crossword
      </h1>
      <nav className='header__nav'>
        {
          (auth.isEmpty && !showLogin) &&
          <a className='header__nav-link' onClick={handleShowLogin}>
            login
          </a>
        }
        {
          !auth.isEmpty &&
          <a className='header__nav-link' onClick={handleLogout}>
            logout
          </a>
        }
        {
          !auth.isEmpty &&
          <a className='header__nav-link' onClick={handleNew}>
            new
          </a>
        }
        {
          !auth.isEmpty &&
          <a className='header__nav-link' href={'/user'}>
            user
          </a>
        }
      </nav>
      {
        showLogin &&
        <div className='header__login-controls'>
          <FirebaseAuth uiConfig={firebaseAuthConfig} firebaseAuth={firebase.auth()} />
          <a className='header__hide-login-button' onClick={handleHideLogin}>
            hide
          </a>
        </div>
      }
    </header>
  );
};

Header.propTypes = {
  auth: PropTypes.object.isRequired,
  firebase: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  withFirebase,
  withRouter,
  connect(({ firebase: { auth } }) => ({ auth })),
)(Header);
