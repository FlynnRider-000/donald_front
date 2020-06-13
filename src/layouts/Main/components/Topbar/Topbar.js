import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Badge, Hidden, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ReactCountryFlag from "react-country-flag"
import InputIcon from '@material-ui/icons/Input';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  }
}));

const Topbar = props => {
  const { className, onSidebarOpen, onSignOut, ...rest } = props;

  const classes = useStyles();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation()

  const language = useSelector(state => state.config.language);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const selectLanguage = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const closeLanguage = (countryCode = "") => {
    setAnchorEl(null);
    if(countryCode === "GB" || countryCode === "DE"){
      i18n.changeLanguage(countryCode === "GB" ? "en" :"de");
      dispatch({ type: "Set_Language", data: countryCode}); 
    }
  }
  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Toolbar>
        <RouterLink to="/">
          <img
            alt="Logo"
            src={require("../../../../assets/images/logo.svg")}
          />
        </RouterLink>
        <div className={classes.flexGrow} />
        <Hidden mdDown>
          <IconButton color="inherit" onClick={selectLanguage}>
            <Badge
              color="primary"
              variant="dot"
            >
              <ReactCountryFlag countryCode={language} svg />
            </Badge>
          </IconButton>
          <IconButton
            className={classes.signOutButton}
            color="inherit"
            onClick={onSignOut}
          >
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={selectLanguage}>
            <Badge
              color="primary"
              variant="dot"
            >
              <ReactCountryFlag countryCode={language} svg />
            </Badge>
          </IconButton>
          <IconButton
            className={classes.signOutButton}
            color="inherit"
            onClick={onSignOut}
          >
            <InputIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={onSidebarOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={closeLanguage}
        >
          <MenuItem onClick={() => closeLanguage("DE")}>
            <ListItemIcon>
              <ReactCountryFlag
                countryCode="DE" 
                style={{
                    fontSize: '2em',
                    lineHeight: '2em',
                }} 
                svg />
            </ListItemIcon>
            <ListItemText primary={t('german.label')} />
          </MenuItem>
          <MenuItem onClick={() => closeLanguage("GB")}> 
            <ListItemIcon>
              <ReactCountryFlag 
                countryCode="GB" 
                style={{
                  fontSize: '2em',
                  lineHeight: '2em',
                }} 
                svg 
                />
            </ListItemIcon>
            <ListItemText primary={t('english.label')} />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default Topbar;
