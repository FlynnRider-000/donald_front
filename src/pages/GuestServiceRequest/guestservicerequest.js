import React,{ useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Button, DialogActions, DialogContent, DialogTitle, Divider, Paper, FormControl, InputLabel, Select, MenuItem, Grid} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import { useTranslation } from 'react-i18next'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { DateTimePicker } from "@material-ui/pickers";
import { useHistory} from 'react-router-dom';
import { useDispatch } from 'react-redux'

import { serverUrl } from '../../api/serverUrl';

const axios = require('axios');

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  termsLink: {
    color: '#1a0dab',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  formControl1: {
    marginTop: theme.spacing(1),
    minWidth: 120,
  },
  px10: {
      padding: 10,
      marginTop: 10,
      marginBottom: 10,
  },
  dlgTitle: {
    fontSize: '17px !important',
    fontWeight: 'bold',
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
  dlgCss: {
    '& .checkbox:focus': {
        outline: 'none !important',
    }
  }
}));


export default function ServiceRequest(props) {
    const classes = useStyles();
    const { t, i18n } = useTranslation();
    let history = useHistory();
    const dispatch = useDispatch();

    const [racketData, setRacketData] = React.useState([]);
    const [stringData, setStringData] = React.useState([]);

    
    const initCustomer = {
        "firstName": "",
        "lastName": "",
        "sportsClub": "",
        "street": "",
        "number": 0,
        "ZIPcode": 0,
        "city": "",
        "eMail": "",
        "phone": ""
    }
    const initRacket = {
        "sportType": 0,
        "Brand": "",
        "Name": "",
        "Grip": ""
    };
    const initString = {
        "Brand": "",
        "Name": "",
        "Thickness": 0,
        "Color": "",
        "Hardness": 0
    }
    const initCurData = {
        "id": 0,
        "date": new Date(),
        "agentId": 0,
        "customerId": 0,
        "racketId": 0,
        "stringId": 0,
        "status": 0,
        "reqPickTime": null,
        "location": "",
        "confPickTime": null,
        "payed": "",
        "User": {
            "id": 0,
            "firstName": "",
            "lastName": "",
        },
        "Racket": {
            "id": 0,
            "sportType": 0,
            "Brand": "",
            "Name": "",
            "Grip": ""
        },
        "String": {
            "id": 0,
            "Brand": "",
            "Name": "",
            "Thickness": 0,
            "Color": "",
            "Hardness": 0
        },
        "Customer": {
            "id": 0,
            "firstName": "",
            "lastName": "",
            "sportsClub": "",
        },
        customerType: "0",
        racketType: "0",
        stringType: "0",
    }
    const [newCustomer, setNewCustomer] = React.useState(initCustomer);
    const [newRacket, setNewRacket] = React.useState(initRacket);
    const [newString, setNewString] = React.useState(initString);
    const [curData, setCurData] = React.useState(initCurData);

    
    const onEntered = () => {
        dispatch({ type: "Set_Language", data: "DE"});
        i18n.changeLanguage("de");

        setCurData(initCurData);
        setNewString(initString);
        setNewRacket(initRacket);
        setNewCustomer(initCustomer);
        
        
        axios.post(serverUrl + 'service/getDropdownList')
        .then(function (res) {
            setRacketData(res.data.rackets);
            setStringData(res.data.strings);
        })
        .catch(function (error){
            console.log(error);
        })
    }

    const handleDateChange = (value) => {
        setCurData({
            ...curData,
            date: value
        });
    }

    const handleDataChange = (event) => {
        setCurData({
            ...curData,
            [event.target.name]: event.target.value
        });
    }
    
    const handleNewCustomerChange = (event) => {
        setNewCustomer({
            ...newCustomer,
            [event.target.name]: event.target.value
        })
    }

    const handleNewRacketChange = (event) => {
        setNewRacket({
            ...newRacket,
            [event.target.name]: event.target.value
        })
    }

    const handleNewStringChange = (event) => {
        setNewString({
            ...newString,
            [event.target.name]: event.target.value
        })
    }

    const handleReqDateChange = (event) => {
        setCurData({
            ...curData,
            reqPickTime: event
        });
    }

    const onCancel = () => {
        history.push('/');
    }

    const onSubmit = () => {
        var res1 = {};
        var res = {};

        var flg = 0;
        res.agentId = -1;
        
        res.stringId = curData.stringId;
        res.racketId = curData.racketId;
        res.date = curData.date.toString();
        res.location = curData.location;
        res.payed = curData.payed;
        res.status = curData.status;
        if(curData.reqPickTime === null || res.location === "")
            flg = 1;
        else 
            res.reqPickTime = new Date(curData.reqPickTime).toString();
        res1.Customer = newCustomer;
        res1.Racket = newRacket;
        res1.String = newString;
        if(flg === 0)
        {
            res1.realdata = res;
            axios.post(serverUrl + 'service/addRequest',{data:JSON.stringify(res1)})
            .then(function (response){
                alert('Vielen Dank. Der Eintrag wurde im System gespeichert.');
                history.push('/');
            })
            .catch(function (error){
                history.push('/');
            })
        }
    }

    useEffect(() => {
        onEntered();
    },[])


    return (
        <React.Fragment>
        <Container
            fullWidth={true}
            maxWidth="md"
            className={classes.dlgCss}
            aria-labelledby="max-width-dialog-title"
        >
            <DialogTitle id="max-width-dialog-title"><div className={classes.dlgTitle}>{t('ServiceRequest.label')}</div></DialogTitle>
            <Divider/>
            <DialogContent>
                <ValidatorForm onSubmit={onSubmit} autocomplete="off">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label={t('Date.label')}
                            value={curData.date}
                            name="date"
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    <Paper variant="outlined" className={classes.px10}>
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
                                onChange={handleNewCustomerChange}
                                required
                                value={newCustomer.firstName}
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
                                onChange={handleNewCustomerChange}
                                required
                                value={newCustomer.lastName}
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
                                onChange={handleNewCustomerChange}
                                required
                                value={newCustomer.street}
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
                                onChange={handleNewCustomerChange}
                                value={newCustomer.number}
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
                                onChange={handleNewCustomerChange}
                                value={newCustomer.ZIPcode}
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
                                onChange={handleNewCustomerChange}
                                required
                                value={newCustomer.city}
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
                                onChange={handleNewCustomerChange}
                                value={newCustomer.sportsClub}
                                variant="outlined"
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
                                type="email"
                                onChange={handleNewCustomerChange}
                                required
                                value={newCustomer.eMail}
                                variant="outlined"
                                validators={['required','isEmail']}
                                errorMessages={['Feld muss ausgefüllt werden','Email is not valid']}
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
                                onChange={handleNewCustomerChange}
                                value={newCustomer.phone}
                                variant="outlined"
                            />
                            </Grid>
                        </Grid>
                    </Paper>
                    <Paper variant="outlined" className={classes.px10}>
                        <Grid
                           container
                           spacing={3}
                        >
                           <Grid
                           item
                           md={6}
                           xs={12}
                           >
                           <FormControl className={classes.formControl} fullWidth>
                                 <Select
                                    labelId="demo-simple-select-outlined-label"
                                    value={newRacket.sportType}
                                    onChange={handleNewRacketChange}
                                    name={"sportType"}
                                    fullWidth
                                 >
                                    <MenuItem value={0}>{t('Badminton.label')}</MenuItem>
                                    <MenuItem value={1}>{t('Tennis.label')}</MenuItem>
                                    <MenuItem value={2}>{t('Squash.label')}</MenuItem>
                                 </Select>
                           </FormControl>
                           </Grid>
                           <Grid
                           item
                           md={6}
                           xs={12}
                           >
                                 <Autocomplete
                                    id="racketbrand"
                                    freeSolo
                                    options={racketData.map(item => item.Brand).filter((value, index, self) => self.indexOf(value) === index)}
                                    onChange={(event, newValue) => {
                                       setNewRacket({
                                             ...newRacket,
                                             Brand: newValue
                                       })
                                    }}
                                    renderInput={(params) => (
                                       <TextValidator 
                                             {...params}
                                             fullWidth
                                             label={t('RacketBrand.label')}
                                             margin="dense"
                                             name="Brand"
                                             value={newRacket.Brand}
                                             onChange={handleNewRacketChange}
                                             required
                                             variant="outlined"
                                             validators={['required']}
                                             errorMessages={['Feld muss ausgefüllt werden']}
                                       />
                                    )}
                                 />
                           </Grid>
                           <Grid
                           item
                           md={6}
                           xs={12}
                           >
                                 <Autocomplete
                                    id="racketbrand1"
                                    freeSolo
                                    onChange={(event, newValue) => {
                                       setNewRacket({
                                             ...newRacket,
                                             Name: newValue
                                       })
                                    }}
                                    options={racketData.filter((option) => option.Brand === newRacket.Brand).map(option => option.Name).filter((value, index, self) => self.indexOf(value) === index)}
                                    renderInput={(params) => (
                                       <TextValidator 
                                             {...params}
                                             fullWidth
                                             label={t('RacketName.label')}
                                             margin="dense"
                                             name="Name"
                                             onChange={handleNewRacketChange}
                                             required
                                             value={newRacket.Name}
                                             variant="outlined"
                                             validators={['required']}
                                             errorMessages={['Feld muss ausgefüllt werden']}
                                       />
                                    )}
                                 />
                           </Grid>
                           <Grid
                           item
                           md={6}
                           xs={12}
                           >
                           <TextValidator 
                                 fullWidth
                                 label={t('RacketGrip.label')}
                                 margin="dense"
                                 name="Grip"
                                 onChange={handleNewRacketChange}
                                 required
                                 value={newRacket.Grip}
                                 variant="outlined"
                                 validators={['required']}
                                 errorMessages={['Feld muss ausgefüllt werden']}
                           />
                           </Grid>
                        </Grid>
                    </Paper>
                    <Paper variant="outlined" className={classes.px10}>
                        <Grid
                           container
                           spacing={3}
                        >
                           <Grid
                           item
                           md={6}
                           xs={12}
                           >
                                 <Autocomplete
                                    id="stringbrand"
                                    freeSolo
                                    options={stringData.map(item => item.Brand).filter((value, index, self) => self.indexOf(value) === index)}
                                    onChange={(event, newValue) => {
                                       setNewString({
                                             ...newString,
                                             Brand: newValue
                                       })
                                    }}
                                    renderInput={(params) => (
                                       <TextValidator 
                                             {...params}
                                             fullWidth
                                             label={t('StringBrand.label')}
                                             margin="dense"
                                             name="Brand"
                                             onChange={handleNewStringChange}
                                             required
                                             value={newString.Brand}
                                             variant="outlined"
                                             validators={['required']}
                                             errorMessages={['Feld muss ausgefüllt werden']}
                                       />
                                    )}
                                 />
                           </Grid>
                           <Grid
                           item
                           md={6}
                           xs={12}
                           >
                                 <Autocomplete
                                    id="stringbrand1"
                                    freeSolo
                                    options={stringData.filter((option) => option.Brand === newString.Brand).map(option => option.Name).filter((value, index, self) => self.indexOf(value) === index)}
                                    onChange={(event, newValue) => {
                                       setNewString({
                                             ...newString,
                                             Name: newValue
                                       })
                                    }}
                                    renderInput={(params) => (
                                       <TextValidator 
                                             {...params}
                                             fullWidth
                                             label={t('StringName.label')}
                                             margin="dense"
                                             name="Name"
                                             onChange={handleNewStringChange}
                                             required
                                             value={newString.Name}
                                             variant="outlined"
                                             validators={['required']}
                                             errorMessages={['Feld muss ausgefüllt werden']}
                                       />
                                    )}
                                 />
                           </Grid>
                           <Grid
                           item
                           md={6}
                           xs={12}
                           >
                           <TextValidator 
                                 fullWidth
                                 label={t('StringThickness.label')}
                                 margin="dense"
                                 name="Thickness"
                                 onChange={handleNewStringChange}
                                 required
                                 type="number"
                                 value={newString.Thickness}
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
                                 label={t('StringColor.label')}
                                 margin="dense"
                                 name="Color"
                                 onChange={handleNewStringChange}
                                 required
                                 value={newString.Color}
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
                                 label={t('StringHardness.label')}
                                 margin="dense"
                                 name="Hardness"
                                 type="number"
                                 onChange={handleNewStringChange}
                                 required
                                 value={newString.Hardness}
                                 variant="outlined"
                                 validators={['required']}
                                 errorMessages={['Feld muss ausgefüllt werden']}
                           />
                           </Grid>
                        </Grid>
                    </Paper>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                        item
                        md={4}
                        xs={12}
                        >
                            <FormControl variant="outlined" className={classes.formControl1} fullWidth>
                                <InputLabel htmlFor="outlined-age-native-simple">{t('status.label')}</InputLabel>
                                <Select
                                    label={t('status.label')}
                                    value={curData.status}
                                    onChange={handleDataChange}
                                    margin="dense"
                                    name={"status"}
                                >
                                    <MenuItem value={0}>{t('statusVal0.label')}</MenuItem>
                                    <MenuItem value={1}>{t('statusVal1.label')}</MenuItem>
                                    <MenuItem value={2}>{t('statusVal2.label')}</MenuItem>
                                    <MenuItem value={3}>{t('statusVal3.label')}</MenuItem>
                                    <MenuItem value={4}>{t('statusVal4.label')}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid
                        item
                        md={4}
                        xs={12}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DateTimePicker
                                    fullWidth
                                    format="yyyy-MM-dd HH:mm"
                                    margin="dense"
                                    label={t('RequestedPickUpDateTime.label')}
                                    inputVariant="outlined"
                                    value={curData.reqPickTime}
                                    name="reqPickTime"
                                    onChange={handleReqDateChange}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid
                        item
                        md={4}
                        xs={12}>
                            <TextValidator 
                                fullWidth
                                label={t('location.label')}
                                margin="dense"
                                name="location"
                                onChange={handleDataChange}
                                required
                                value={curData.location}
                                variant="outlined"
                                validators={['required']}
                                errorMessages={['Feld muss ausgefüllt werden']}
                            />
                        </Grid>
                    </Grid>
                    <DialogActions>
                        <Button color="primary" type="submit">
                            {t('Add.label')}
                        </Button>
                        <Button onClick={onCancel} color="primary">
                            {t('MailCancel.label')}
                        </Button>
                    </DialogActions>
                </ValidatorForm>
            </DialogContent>
        </Container>
        </React.Fragment>
    );
}