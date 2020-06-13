import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
} from '@material-ui/core';

import { useTranslation } from 'react-i18next'

import { useSelector, useDispatch  } from 'react-redux'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

import { serverUrl } from '../../../../api/serverUrl';
const axios = require('axios');

const useStyles = makeStyles(() => ({
  root: {}
}));

const AccountDetails = props => {
  const { className, ...rest } = props;

  const { t } = useTranslation();

  const classes = useStyles();
  const userId = useSelector(state => state.user.userId);
  const role = useSelector(state => state.user.userRole);
  const dispatch = useDispatch();

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    street: "",
    number: 0,
    ZIPcode: 11111,
    city: "",
    sportsClub:"",
    eMail: "",
    phone: ""
  });

  const handleChange = event => {
    setUserInfo({
      ...userInfo,
      [event.target.name]: event.target.value
    });
  };

  const getUser = useCallback(() => {
    axios.post(serverUrl + 'user/getUser',{userId})
    .then(function (response){
      setUserInfo(response.data);
      let res = {
        name: response.data.firstName + " " + response.data.lastName,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        id: response.data.id,
        role: role,
      }
      dispatch({ type: "Set_UserData", data: res}); 
    })
    .catch(function (error){
        console.log(error);
    });
  }, [userId, role,dispatch]);

  useEffect(() => {
    getUser();
  },[getUser])

  const handleChangeUserData = () => {
    axios.post(serverUrl + 'user/updateUser',{ userInfo })
   .then(function (response){
      getUser();
   })
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <ValidatorForm
        className={classes.form}
        onSubmit={handleChangeUserData}
      >
        <CardHeader
          subheader={t('ProfileDescription.label')}
          title={t('Profile.label')}
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextValidator 
                fullWidth
                label={t('FirstName.label')}
                margin="dense"
                name="firstName"
                onChange={handleChange}
                required
                value={userInfo.firstName}
                variant="outlined"
                validators={['required']}
                errorMessages={['Feld muss ausgefüllt werden']}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextValidator 
                fullWidth
                label={t('LastName.label')}
                margin="dense"
                name="lastName"
                onChange={handleChange}
                required
                value={userInfo.lastName}
                variant="outlined"
                validators={['required']}
                errorMessages={['Feld muss ausgefüllt werden']}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextValidator 
                fullWidth
                label={t('Street.label')}
                margin="dense"
                name="street"
                onChange={handleChange}
                required
                value={userInfo.street}
                variant="outlined"
                validators={['required']}
                errorMessages={['Feld muss ausgefüllt werden']}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextValidator 
                fullWidth
                label={t('Number.label')}
                margin="dense"
                name="number"
                type="number"
                onChange={handleChange}
                required
                value={userInfo.number}
                variant="outlined"
                validators={['required']}
                errorMessages={['Feld muss ausgefüllt werden']}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextValidator 
                fullWidth
                label={t('ZIPcode.label')}
                margin="dense"
                name="ZIPcode"
                type="number"
                onChange={handleChange}
                required
                value={userInfo.ZIPcode}
                variant="outlined"
                validators={['required']}
                errorMessages={['Feld muss ausgefüllt werden']}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextValidator 
                fullWidth
                label={t('City.label')}
                margin="dense"
                name="city"
                onChange={handleChange}
                required
                value={userInfo.city}
                variant="outlined"
                validators={['required']}
                errorMessages={['Feld muss ausgefüllt werden']}
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextValidator 
                fullWidth
                label={t('SportsClub.label')}
                margin="dense"
                name="sportsClub"
                onChange={handleChange}
                required
                value={userInfo.sportsClub}
                variant="outlined"
                validators={['required']}
                errorMessages={['Feld muss ausgefüllt werden']}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextValidator 
                fullWidth
                label={t('EmailAddress.label')}
                margin="dense"
                name="eMail"
                onChange={handleChange}
                required
                value={userInfo.eMail}
                variant="outlined"
                validators={['required']}
                errorMessages={['Feld muss ausgefüllt werden']}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextValidator 
                fullWidth
                label={t('PhoneNumber.label')}
                margin="dense"
                name="phone"
                onChange={handleChange}
                value={userInfo.phone}
                variant="outlined"
                validators={['required']}
                errorMessages={['Feld muss ausgefüllt werden']}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            type="submit"
            variant="contained"
          >
            {t('SaveDetails.label')}
          </Button>
        </CardActions>
      </ValidatorForm>
    </Card>
  );
};

AccountDetails.propTypes = {
  className: PropTypes.string
};

export default AccountDetails;
