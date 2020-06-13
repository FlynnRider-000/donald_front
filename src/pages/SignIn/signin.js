import React from 'react';
import {
   Grid,
   Button,
   Typography
} from '@material-ui/core';

import { useHistory } from 'react-router-dom';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useDispatch } from 'react-redux'
import { serverUrl } from '../../api/serverUrl';
import { default as pageStyle } from './style';

import { useTranslation } from 'react-i18next'

const axios = require('axios');

export default function Signin(props) {

   const classes = pageStyle();
   let history = useHistory();
   const dispatch = useDispatch();

   const { i18n } = useTranslation()

   const [signInFailed, setSignInFailed] = React.useState(0);
   const [username, setUsername] = React.useState("");
   const [password, setPassword] = React.useState("");

   const handleSignIn = () => {
      axios.post(serverUrl + 'signin', {
         name: username,
         pass: password
      })
      .then(function (response){
         if(response.data.exist){
            const res = response.data;
            dispatch({ type: "Set_UserData", data: res}); 
            dispatch({ type: "Set_Language", data: "DE"});
            i18n.changeLanguage("de");
            history.push('/servicerequest');
         }
         else{
            setSignInFailed(1);
            setTimeout(function(){
               setSignInFailed(0);
            },3000);
         }
      })
      .catch(function (error){
         console.log(error);
      })
   }

   return (
      <div className={classes.root}>
      <Grid
        className={classes.grid}
        container
      >
         <Grid
            className={classes.quoteContainer}
            item
            lg={5}
         >
            <div className={classes.quote}>
               <div className={classes.quoteInner}>
                  <Typography
                     className={classes.quoteText}
                     variant="h1"
                  >
                     Hella narwhal Cosby sweater McSweeney's, salvia kitsch before
                     they sold out High Life.
                  </Typography>
                  <div className={classes.person}>
                     <Typography
                        className={classes.name}
                        variant="body1"
                     >
                        Takamaru Ayako
                     </Typography>
                     <Typography
                        className={classes.bio}
                        variant="body2"
                     >
                        Manager at inVision
                     </Typography>
                  </div>
               </div>
            </div>
         </Grid>
         <Grid
            className={classes.content}
            item
            lg={7}
            xs={12}
         >
            <div className={classes.content}>
               <div className={classes.contentBody}>
                  <ValidatorForm
                     className={classes.form}
                     onSubmit={handleSignIn}
                  >
                     <Typography
                        className={classes.title}
                        variant="h2"
                     >
                        Willkommen
                     </Typography>
                     <Typography
                        color="textSecondary"
                        gutterBottom
                     >
                        Herzlich Willkommen im Besaitungs-Portal von Donald Schulz Sport
                     </Typography>
                     {
                        signInFailed === 1 && (
                           <Alert severity="error">
                              <AlertTitle>Fehler bei der Anmeldung</AlertTitle>
                              Falscher Benutzername und/oder Passwort
                           </Alert>
                        )
                     }
                     <TextValidator 
                        className={classes.textField}
                        fullWidth
                        label="Benutzername"
                        name="username"
                        value={username}
                        variant="outlined"
                        onChange={(event)=>setUsername(event.target.value)}
                        validators={['required']}
                        errorMessages={['Feld muss ausgefüllt werden']}
                     />
                     <TextValidator 
                        className={classes.textField}
                        fullWidth
                        label="Passwort"
                        name="password"
                        type="password"
                        value={password}
                        variant="outlined"
                        onChange={(event)=>setPassword(event.target.value)}
                        validators={['required']}
                        errorMessages={['Feld muss ausgefüllt werden']}
                     />
                     <Button
                        className={classes.signInButton}
                        color="primary"
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                     >
                        Anmelden
                     </Button>
                  </ValidatorForm>
               </div>
            </div>
         </Grid>
      </Grid>
    </div>
   );
}

