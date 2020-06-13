import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import SportsTennisIcon from '@material-ui/icons/SportsTennis';
import TextureIcon from '@material-ui/icons/Texture';

import { useSelector } from 'react-redux'

import { Profile, SidebarNav} from './components';

import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();
  const userRole = useSelector(state => state.user.userRole);
  
  const { t } = useTranslation()

  const pages = [
    {
      title: t('ServiceRequest.label'),
      href: '/servicerequest',
      icon: <ShoppingBasketIcon />
    },
    {
      title: t('Customer.label'),
      href: '/customer',
      icon: <SupervisorAccountIcon />
    },
    {
      title: t('Racket.label'),
      href: '/racket',
      icon: <SportsTennisIcon />
    },
    {
      title: t('String.label'),
      href: '/string',
      icon: <TextureIcon />
    },
    {
      title: t('AccountSetting.label'),
      href: '/account',
      icon: <AccountBoxIcon />
    },
  ];

  if(userRole === 0)
  {
    pages.unshift({
      title: t('Users.label'),
      href: '/users',
      icon: <PeopleIcon />
    })
  }

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Profile />
        <Divider className={classes.divider} />
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
