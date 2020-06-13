import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Paper, RadioGroup, FormControlLabel, Radio,
        FormControl, InputLabel, Select, MenuItem, Grid} from '@material-ui/core';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import { useTranslation } from 'react-i18next'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { DateTimePicker } from "@material-ui/pickers";

import { useSelector } from 'react-redux'

import { serverUrl } from '../../../api/serverUrl';
const axios = require('axios');

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
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
}));

export default function ServiceRequest(props) {
    const classes = useStyles();
    const { opened, onAdd, onClose, data} = props;
    const { t } = useTranslation();
    const [refData, setRefData] = React.useState([]);
    
    const userId = useSelector(state => state.user.userId);
    const userRole = useSelector(state => state.user.userRole);
    
    const sports = [t('Badminton.label'), t('Tennis.label'), t('Squash.label')]

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

    const handleClose = () => {
        onClose();
    };

    const onEntered = () => {
        setCurData(initCurData);
        setNewString(initString);
        setNewRacket(initRacket);
        setNewCustomer(initCustomer);
        
        axios.post(serverUrl + 'service/getData',{userId,userRole})
        .then(function (response){
            setRefData(response.data);
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

    const onSubmit = () => {
        var res1 = {};
        var res = {};

        var flg = 0;
        res.agentId = userId;
        
        res.stringId = curData.stringId;
        res.racketId = curData.racketId;
        res.date = curData.date.toString();
        res.location = curData.location;
        res.payed = curData.payed;
        res.status = curData.status;
        if(curData.reqPickTime === null)
            flg = 1;
        else 
            res.reqPickTime = new Date(curData.reqPickTime).toString();
        if(curData.customerType === "0" && curData.customerId === 0)
            flg = 1;
        else if (curData.customerType === "0" && curData.customerId !== 0)
            res.customerId = curData.customerId;
        else
            res1.Customer = newCustomer;
        if(curData.racketType === "0" && curData.racketId === 0)
            flg = 1;
        else if (curData.racketType === "0" && curData.racketId !== 0)
            res.racketId = curData.racketId;
        else
            res1.Racket = newRacket;
        if(curData.stringType === "0" && curData.stringId === 0)
            flg = 1;
        else if(curData.stringType === "0" && curData.stringId !== 0)
            res.stringId = curData.stringId;
        else
            res1.String = newString;
        if(flg === 0)
        {
            res1.realdata = res;
            onAdd(res1);
        }
    }

    return (
        <React.Fragment>
        <Dialog
            fullWidth={true}
            maxWidth="md"
            open={opened}
            onEntered={onEntered}
            onClose={handleClose}
            aria-labelledby="max-width-dialog-title"
        >
            <DialogTitle id="max-width-dialog-title"><div className={classes.dlgTitle}>{t('ServiceRequest.label')}</div></DialogTitle>
            <Divider/>
            <DialogContent>
                <ValidatorForm onSubmit={onSubmit}>
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
                        <RadioGroup row aria-label="position" onChange={handleDataChange} name="customerType" defaultValue="0">
                            <FormControlLabel value="0" control={<Radio color="primary" />} label={t('SelExCst.label')} />
                            <FormControlLabel value="1" control={<Radio color="primary" />} label={t('ANCst.label')} />
                        </RadioGroup>
                        {
                            curData.customerType === "0" ? (
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
                                                id="demo-simple-select-outlined"
                                                value={curData.customerId}
                                                onChange={handleDataChange}
                                                name={"customerId"}
                                                label="Age"
                                            >
                                            {
                                                refData.customers && refData.customers.map(data => (
                                                    <MenuItem key={data.id} value={data.id}>{data.firstName+" "+data.lastName+" : "+data.sportsClub}</MenuItem>
                                                ))   
                                            } 
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            ): (
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
                                        type="number"
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
                                        required
                                        value={newCustomer.sportsClub}
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
                            )
                        }
                    </Paper>
                    <Paper variant="outlined" className={classes.px10}>
                        <RadioGroup row aria-label="position" onChange={handleDataChange} name="racketType" defaultValue="0">
                            <FormControlLabel value="0" control={<Radio color="primary" />} label={t('SelExRckt.label')} />
                            <FormControlLabel value="1" control={<Radio color="primary" />} label={t('ANRckt.label')} />
                        </RadioGroup>
                        {
                            curData.racketType === "0" ? (
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
                                            id="demo-simple-select-outlined"
                                            value={curData.racketId}
                                            onChange={handleDataChange}
                                            name={"racketId"}
                                        >
                                        {
                                            curData.customerType === "0" && curData.customerId !== 0 && refData.rackets && refData.rackets.map(data1 => {
                                                for(var i = 0 ; i < data.length ; i ++){
                                                    if(curData.customerId === data[i].Customer.id && data1.id === data[i].Racket.id)
                                                        return (<MenuItem key={data1.id} value={data1.id}>{sports[data1.sportType]+" : "+data1.Brand+" : "+data1.Name+" : "+data1.Grip}</MenuItem>)
                                                }
                                                return (null)
                                            })   
                                        }
                                        </Select>
                                    </FormControl>
                                    </Grid>
                                </Grid>
                            ): (
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
                                        <TextValidator 
                                            fullWidth
                                            label={t('RacketBrand.label')}
                                            margin="dense"
                                            name="Brand"
                                            onChange={handleNewRacketChange}
                                            required
                                            value={newRacket.Brand}
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
                            )
                        }
                    </Paper>
                    <Paper variant="outlined" className={classes.px10}>
                        <RadioGroup row aria-label="position" onChange={handleDataChange} name="stringType" defaultValue="0">
                            <FormControlLabel value="0" control={<Radio color="primary" />} label={t('SelExStr.label')} />
                            <FormControlLabel value="1" control={<Radio color="primary" />} label={t('ANStr.label')} />
                        </RadioGroup>
                        {
                            curData.stringType === "0" ? (
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
                                            id="demo-simple-select-outlined"
                                            value={curData.stringId}
                                            onChange={handleDataChange}
                                            name={"stringId"}
                                        >
                                        {
                                            curData.customerType === "0" && curData.customerId !== 0 && curData.racketType === "0" && curData.racketId !== 0 && refData.strings && refData.strings.map(data1 => {
                                                for(var i = 0 ; i < data.length ; i ++){
                                                    if(curData.customerId === data[i].Customer.id && curData.racketId === data[i].Racket.id && data1.id === data[i].String.id)
                                                        return (<MenuItem key={data1.id} value={data1.id}>{data1.Brand+" : "+data1.Name+" : "+data1.Thickness+" : "+data1.Color+" : "+data1.Hardness}</MenuItem>)
                                                }
                                                return (null)
                                            })   
                                        }
                                        </Select>
                                    </FormControl>
                                    </Grid>
                                </Grid>
                            ): (
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
                                    </Grid>
                                    <Grid
                                    item
                                    md={6}
                                    xs={12}
                                    >
                                        <TextValidator 
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
                            )
                        }
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
                    <Divider/>
                    <DialogActions>
                        <Button color="primary" type="submit">
                            {t('Add.label')}
                        </Button>
                        <Button onClick={handleClose} color="primary">
                            {t('Close.label')}
                        </Button>
                    </DialogActions>
                </ValidatorForm>
            </DialogContent>
        </Dialog>
        </React.Fragment>
    );
}