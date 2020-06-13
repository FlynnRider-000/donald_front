import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Typography,
  Divider,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

import { useTranslation } from 'react-i18next'

import { useSelector } from 'react-redux'

import { serverUrl } from '../../../../api/serverUrl';
const axios = require('axios');

const useStyles = makeStyles(theme => ({
  root: {},
  details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    height: 100,
    width: 100,
    flexShrink: 0,
    flexGrow: 0
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  uploadButton: {
    marginRight: theme.spacing(2)
  }
}));

const AccountProfile = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const { t } = useTranslation()
  
  const name = useSelector(state => state.user.fullName);
  const userId = useSelector(state => state.user.userId);
  const [alertId, setAlertId] = React.useState(0);
  const [opass, setOpass] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [confirm, setConfirm] = React.useState("");

  const handleUpdatePassword = () => {
    axios.post(serverUrl + 'user/updatePass',{ userId, opass, pass, confirm })
    .then(function (response){
      console.log(response.data);
        setAlertId(parseInt(response.data));
        setTimeout(() => {setAlertId(0)},3000);
    })
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <div className={classes.details}>
          <div>
            <Typography
              gutterBottom
              variant="h2"
            >
              {name}
            </Typography>
          </div>
          <Avatar
            className={classes.avatar}
            src={"avatar"}
          />
        </div>
      </CardContent>
      <Divider />
      <ValidatorForm
          className={classes.form}
          onSubmit={handleUpdatePassword}
      >
        <CardContent>
          <TextValidator 
            fullWidth
            label={t('OldPassword.label')}
            name="oldpassword"
            value={opass}
            onChange={(event)=>{setOpass(event.target.value)}}
            type="password"
            variant="outlined"
            validators={['required']}
            errorMessages={['Feld muss ausgefüllt werden']}
          />
          <TextValidator 
            fullWidth
            label={t('NewPassword.label')}
            name="password"
            type="password"
            value={pass}
            onChange={(event)=>{setPass(event.target.value)}}
            style={{ marginTop: '1rem' }}
            variant="outlined"
            validators={['required']}
            errorMessages={['Feld muss ausgefüllt werden']}
          />
          <TextValidator 
            fullWidth
            label={t('ConfirmPassword.label')}
            name="confirm"
            value={confirm}
            onChange={(event)=>{setConfirm(event.target.value)}}
            style={{ marginTop: '1rem' }}
            type="password"
            variant="outlined"
            validators={['required']}
            errorMessages={['Feld muss ausgefüllt werden']}
          />
          {
            alertId === 3 ? (<Alert style={{ marginTop: '1rem' }} severity="success">{t('PswdChgSuc.label')}</Alert>):
            alertId === 2 ? (<Alert style={{ marginTop: '1rem' }} severity="warning">{t('OPswdInc.label')}</Alert>):
            alertId === 1? (<Alert style={{ marginTop: '1rem' }} severity="warning">{t('NPswdMisMtc.label')}</Alert>) : (<></>)
          }
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="outlined"
            type="submit"
          >
            {t('Update.label')}
          </Button>
        </CardActions>
      </ValidatorForm>
    </Card>
  );
};

AccountProfile.propTypes = {
  className: PropTypes.string
};

export default AccountProfile;
