import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery } from '@material-ui/core';

import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { Sidebar, Topbar, Footer } from './components';

import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 56,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64
    }
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: '100%'
  }
}));

const Main = props => {
  const { children } = props;

  let history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  });

  const [openSidebar, setOpenSidebar] = useState(false);

  const signedIn = useSelector(state => state.user.signedIn);
  const language = useSelector(state => state.config.language);

  const {i18n} = useTranslation();

  useEffect(() => {
    if(!signedIn){
      history.push('/signin');
    }
    if(language === "GB" && i18n.language !== "en")
      i18n.changeLanguage("en");
    else if(language === "DE" && i18n.language !== "de")
      i18n.changeLanguage("de");
  });

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const handleSignOut = () => {
    dispatch({ type: "Set_UserLogOut"});
    history.push("/signin");
  }

  const shouldOpenSidebar = isDesktop ? true : openSidebar;

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}
    >
      <Topbar onSidebarOpen={handleSidebarOpen} onSignOut={handleSignOut}/>
      <Sidebar
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? 'persistent' : 'temporary'}
      />
      <main className={classes.content}>
        {children}
        <Footer />
      </main>
    </div>
  );
};

Main.propTypes = {
  children: PropTypes.node
};

export default Main;
