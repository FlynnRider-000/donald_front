import React,{ useEffect, useCallback } from 'react';

import MaterialTable from 'material-table';
import { default as pageStyle } from './style';

import { useTranslation } from 'react-i18next'

import {
   Card,
   Toolbar, 
   IconButton,
   Typography
} from '@material-ui/core';
import AddBox from '@material-ui/icons/AddBox';

import { useSelector } from 'react-redux'

import { default as ServiceRequestModal} from './Component/requestmodal';
import { default as AddServiceRequestModal} from './Component/addrequestmodal';
import { default as MailDlg} from './Component/maildialog';

import { serverUrl } from '../../api/serverUrl';

const axios = require('axios');

export default function MaterialTableDemo() {
   const classes = pageStyle();
   const { t } = useTranslation()

   const [openDlg, setOpenDlg] = React.useState(false);
   const [openMailDlg, setOpenMailDlg] = React.useState(false);
   const [openAddDlg, setOpenAddDlg] = React.useState(false);
   const [curData, setCurData] = React.useState({});
   const [mailType, setMailType] = React.useState(0);

   const userRole = useSelector(state => state.user.userRole);
   const userId = useSelector(state => state.user.userId);

   const compareFunction = (a,b,key) => {
      key = key.split(".");
      var abc = a[key[0]] === undefined ? "" : a[key[0]][key[1]];
      var abcd = b[key[0]] === undefined ? "" : b[key[0]][key[1]];
      console.log(a);
      return abc.toLowerCase() >  abcd.toLowerCase() ? 1: -1;
   }

   const getDateFormat = (m_date) => {
      var temp = new Date(m_date);
      var res = "";
      res += temp.getFullYear();
      res += "/"
      res += ((temp.getMonth() + 1) < 10 ? "0" + (temp.getMonth() + 1) : (temp.getMonth() + 1));
      res += "/"
      res += (temp.getDate() < 10 ? "0" + temp.getDate() : temp.getDate());
      return res;
  }

  const getTimeFormat = (m_date) => {
      var temp = new Date(m_date);
      var res = "";
      res += (temp.getHours() < 10 ? "0" + temp.getHours() : temp.getHours());
      res += ":"
      res += (temp.getMinutes() < 10 ? "0" + temp.getMinutes() : temp.getMinutes());
      return res;
  }

   const columns = [
      { title: t('Date.label'), field: 'date', defaultSort:'desc', cellStyle:{minWidth:'120px'}},
      { title: t('RequestedPickUpDateTime.label'), render: rowData => {let temp = new Date(rowData.reqPickTime); return rowData.reqPickTime !== null ? getDateFormat(rowData.reqPickTime)+ " " + getTimeFormat(rowData.reqPickTime): ""}, customSort:(a,b) => a.reqPickTime > b.reqPickTime ? 1: -1},
      { title: t('status.label'), field: 'status', lookup: { 4:'abgeholt', 3: 'im Club (b)', 2: 'im Laden (b)', 1: 'im Laden (u)', 0: 'im Club (u)' }},
      { title: t('CustomerName.label'), customSort: (a, b) => (a.Customer.firstName + a.Customer.lastName).toLowerCase() > (b.Customer.firstName + b.Customer.lastName).toLowerCase() ? 1 : -1, customFilterAndSearch: (term, rowData) => (rowData.Customer.firstName + " " + rowData.Customer.lastName).includes(term), render: rowData => rowData.Customer && (rowData.Customer.firstName + " " + rowData.Customer.lastName)},
      { title: t('location.label'), field: 'location', customSort: (a, b) => compareFunction(a,b,'location')},
      { title: t('ConfirmedPickUpDateTime.label'), render: rowData => {let temp = new Date(rowData.confPickTime); return rowData.confPickTime !== null ? getDateFormat(rowData.confPickTime) + " " + getTimeFormat(rowData.confPickTime): ""}, customSort:(a,b) => a.confPickTime > b.confPickTime ? 1: -1},
      { title: t('Payed.label'), field: 'payed', render: rowData => {return rowData.payed === 'no' ? 'nein' : rowData.payed}},
      { title: t('RacketBrand.label'), field: 'Racket.Brand', customSort: (a, b) => compareFunction(a,b,'Racket.Brand')},
      { title: t('RacketName.label'), field: 'Racket.Name', customSort: (a, b) => compareFunction(a,b,'Racket.Name')},
      { title: t('RacketGrip.label'), field: 'Racket.Grip', customSort: (a, b) => compareFunction(a,b,'Racket.Grip') },
      { title: t('SportType.label'), field: 'Racket.sportType', lookup: { 2: 'Squash', 1: 'Tennis', 0: 'Badminton' }},
      { title: t('StringBrand-SR.label'), field: 'String.Brand', customSort: (a, b) => compareFunction(a,b,'String.Brand')},
      { title: t('StringName.label'), field: 'String.Name', customSort: (a, b) => compareFunction(a,b,'String.Name')},
      { title: t('StringThickness.label'), field: 'String.Thickness', type: 'numeric', headerStyle: {textAlign:'left', flexDirection:'row'}, cellStyle: {textAlign:'left'}, sorting:false},
      { title: t('StringColor.label'), field: 'String.Color', customSort: (a, b) => compareFunction(a,b,'String.Color')},
      { title: t('StringHardness.label'), field: 'String.Hardness', type: 'numeric', headerStyle: {textAlign:'left', flexDirection:'row'}, cellStyle: {textAlign:'left'}, sorting:false},
      { title: t('Agent.label'), customFilterAndSearch: (term, rowData) => (rowData.User.firstName + " " + rowData.User.lastName).includes(term),render: rowData => rowData.User.firstName + " " + rowData.User.lastName, customSort: (a, b) => (a.User.firstName + a.User.lastName).toLowerCase() > (b.User.firstName + b.User.lastName).toLowerCase() ? 1 : -1},

      { title: t('SportsClub.label'), field: 'Customer.sportsClub', customSort: (a, b) => compareFunction(a,b,'Customer.sportsClub')},
      
      
      
   ];

   const [data, setData] = React.useState([]);

   const initCustomer = {
      id: 0,
      lastName: "",
      firstName: "",
      street: "",
      number: 0,
      ZIPcode: 0,
      city: "",
      sportsClub: "",
      eMail: "",
      phone: ""
   };

   const initRacket = {
      id: 0,
      sportType: -1,
      Brand: "",
      Name: "",
      Grip: "",
   };

   const initString = {
      id: 0,
      Brand: "",
      Name: "",
      ThickNess: 0,
      Color: "",
      Hardness: 0,
   };

   const getRequests = useCallback(() => {
      axios.post(serverUrl + 'service/getRequests',{userId,userRole})
      .then(function (response){
         var tt = response.data;
         for(var i = 0 ; i < tt.length; i++){
            if(tt[i].User === null){
               tt[i].User = {
                  id: -1,
                  firstName: '',
                  lastName: ''
               };
            }
            if(tt[i].String === null){
               tt[i].String = initString;
            }
            if(tt[i].Racket === null){
               tt[i].Racket = initRacket;
               tt[i].String = initString;
            }
            if(tt[i].Customer === null) {
               tt[i].Customer = initCustomer;
               tt[i].Racket = initRacket;
               tt[i].String = initString;
            }
         }         
         setData(tt);
      })
      .catch(function (error){
         console.log(error);
      })
   }, [userId,userRole])

   useEffect(() => {
      getRequests();
   },[getRequests])

   const onDlgClose = () => {
      setOpenDlg(false);
      setOpenAddDlg(false);
      setOpenMailDlg(false);
   }

   const onServiceUpdate = (updateData) => {
      axios.post(serverUrl + 'service/updateRequest',{data:JSON.stringify(updateData)})
      .then(function (response){
         getRequests();
         setOpenDlg(false);
      })
      .catch(function (error){
         console.log(error);
         setOpenDlg(false);
      })
   }

   const onAddService = (newData) => {
      axios.post(serverUrl + 'service/addRequest',{data:JSON.stringify(newData)})
      .then(function (response){
         getRequests();
         setOpenAddDlg(false);
      })
      .catch(function (error){
         console.log(error);
         setOpenAddDlg(false);
      })
   }

   const onSendMail = (data) => {
      data.type = mailType;
      axios.post(serverUrl + 'service/sendMail',{data:JSON.stringify(data)})
      .then(function (response){
         if(response.data === 'okay'){
            alert(t('MailOkay.label'));
         }
         else
         {
            alert(response.data);
         }
         setOpenMailDlg(false);
      })
      .catch(function (error){
         console.log(error);
         setOpenAddDlg(false);
      })
   }

   return ( 
      <div className={classes.root}>
         <Card className={classes.cardRoot}>
            <MaterialTable
               columns={columns}
               data={data}
               components={{
                  Toolbar: props => (
                     <>
                        <Toolbar>
                           <Typography>{t('ServiceRequest.label')}</Typography>
                           <div style={{flexGrow: 1}} />
                           <IconButton
                              onClick={() => setOpenAddDlg(true)}
                           >
                              <AddBox/>
                           </IconButton>
                        </Toolbar>
                     </>
                  )
               }}
               options={{
                  search: false,
                  filtering: true,
                  pageSize: 10,
                  cellStyle: {
                     border: '1px solid #eee',
                  },
                  headerStyle: {
                     border: '2px solid #ddd',
                  },
                  filterCellStyle: {
                     border: '1px solid #eee',
                  },
                  actionsCellStyle: {
                     '&': {
                        color: 'red !important',
                     },
                  }
               }}
               localization={{
                  body: {
                     emptyDataSourceMessage: t('body.emptyDataSourceMessage.label'),
                     addTooltip: t('body.addTooltip.label'),
                     deleteTooltip: t('body.deleteTooltip.label'),
                     editTooltip: t('body.editTooltip.label'),
                     filterRow: {
                        filterTooltip: t('body.filterRow.filterTooltip.label'),
                     },
                     editRow: {
                        deleteText: t('body.editRow.deleteText.label'),
                        cancelTooltip: t('body.editRow.cancelTooltip.label'),
                        saveTooltip: t('body.editRow.saveTooltip.label'),
                     }
                  },
                  grouping: {
                     placeholder: t('grouping.placeholder.label'),
                  },
                  header: {
                     actions: t('header.actions.label'),
                  },
                  pagination: {
                     labelDisplayedRows: t('pagination.labelDisplayedRows.label'),
                     labelRowsSelect: t('pagination.labelRowsSelect.label'),
                     labelRowsPerPage: t('pagination.labelRowsPerPage.label'),
                     firstAriaLabel: t('pagination.firstAriaLabel.label'),
                     firstTooltip: t('pagination.firstTooltip.label'),
                     previousAriaLabel: t('pagination.previousAriaLabel.label'),
                     previousTooltip: t('pagination.previousTooltip.label'),
                     nextAriaLabel: t('pagination.nextAriaLabel.label'),
                     nextTooltip: t('pagination.nextTooltip.label'),
                     lastAriaLabel: t('pagination.lastAriaLabel.label'),
                     lastTooltip: t('pagination.lastTooltip.label'),
                  },
                  toolbar: {
                     addRemoveColumns: t('toolbar.addRemoveColumns.label'),
                     nRowsSelected: t('toolbar.nRowsSelected.label'),
                     showColumnsTitle: t('toolbar.showColumnsTitle.label'),
                     showColumnsAriaLabel: t('toolbar.showColumnsAriaLabel.label'),
                     exportTitle: t('toolbar.exportTitle.label'),
                     exportAriaLabel: t('toolbar.exportAriaLabel.label'),
                     exportName: t('toolbar.exportName.label'),
                     searchTooltip: t('toolbar.searchTooltip.label'),
                     searchPlaceholder: t('toolbar.searchPlaceholder.label'),
                  }
               }}
               editable={userRole === 0 ? {
                  onRowDelete: (oldData) =>
                     new Promise((resolve) => {
                        setTimeout(() => {
                        resolve();
                        axios.post(serverUrl + 'service/deleteServiceRequest',{
                           serviceId: data[data.indexOf(oldData)].id
                        })
                        .then(function (response){
                           getRequests();
                        })
                        }, 600);
                     })
                  }:{
               }}
               actions={userRole === 0 ? [
                  {
                     icon: 'edit',
                     iconProps: { style: { fontSize: "24px" } },
                     tooltip: t('EditServiceRequest.label'),
                     onClick: (event, rowData) => {
                        if(rowData.User.id === userId || userRole === 0){
                           setCurData(rowData);
                           setOpenDlg(true);
                        }
                     }
                  },
                  {
                     icon: 'email',
                     tooltip: t('SendToCustomer.label'),
                     iconProps: { style: { fontSize: "24px" } },
                     onClick: (event, rowData) => {
                        if(rowData.User.id === userId || userRole === 0){
                           setCurData(rowData);
                           setMailType(0);
                           setOpenMailDlg(true);
                        }
                     }
                  },
                  {
                     icon: 'send',
                     tooltip: t('SendToAgent.label'),
                     iconProps: { style: { fontSize: "24px" } },
                     onClick: (event, rowData) => {
                        if(rowData.User.id === userId || userRole === 0){
                           setCurData(rowData);
                           setMailType(1);
                           setOpenMailDlg(true);
                        }
                     }
                  }
               ]:[
                  {
                     icon: 'edit',
                     tooltip: t('EditServiceRequest.label'),
                     onClick: (event, rowData) => {
                        setCurData(rowData);
                        setOpenDlg(true);
                     }
                  }
               ]}
            />
         </Card>
         <ServiceRequestModal opened={openDlg} onUpdate={onServiceUpdate} onClose={onDlgClose} data ={curData}/>
         <AddServiceRequestModal opened={openAddDlg} onAdd={onAddService} onClose={onDlgClose} data ={data}/>
         <MailDlg opened={openMailDlg} type={mailType} onSend={onSendMail} onClose={onDlgClose} data ={curData}/>
      </div>
   );
}