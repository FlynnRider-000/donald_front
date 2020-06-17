import React,{ useEffect, useCallback } from 'react';

import MaterialTable from 'material-table';
import { default as pageStyle } from './style';

import { useTranslation } from 'react-i18next'

import {
   Card
} from '@material-ui/core';

import { serverUrl } from '../../api/serverUrl';
import { useSelector } from 'react-redux'
const axios = require('axios');

export default function MaterialTableDemo() {
   const classes = pageStyle();
   const { t } = useTranslation()

   const columns = [
      { title: t('RacketBrand.label'), field: 'Racket.Brand', customSort: (a, b) => compareFunction(a,b,'Racket.Brand')},
      { title: t('RacketName.label'), field: 'Racket.Name', customSort: (a, b) => compareFunction(a,b,'Racket.Name')},
      { title: t('RacketGrip.label'), field: 'Racket.Grip', customSort: (a, b) => compareFunction(a,b,'Racket.Grip') },
      { title: t('SportType.label'), field: 'Racket.sportType', lookup: { 2: 'Squash', 1: 'Tennis', 0: 'Badminton' }},
      { title: t('CustomerName-Racket.label'), editable: 'never', filtering: false, customSort: (a, b) => (a.Customer.firstName + a.Customer.lastName).toLowerCase() > (b.Customer.firstName + b.Customer.lastName).toLowerCase() ? 1 : -1, customFilterAndSearch: (term, rowData) => (rowData.Customer.firstName + " " + rowData.Customer.lastName).includes(term), render: rowData => rowData.Customer && (rowData.Customer.firstName + " " + rowData.Customer.lastName + "/" + rowData.Customer.sportsClub)},
   ];

   const [data, setData] = React.useState([]);

   const userRole = useSelector(state => state.user.userRole);
   const userId = useSelector(state => state.user.userId);

   const compareFunction = (a,b,key) => {
      key = key.split(".");
      return a[key[0]][key[1]].toLowerCase() > b[key[0]][key[1]].toLowerCase() ? 1: -1;
   }

   const getRackets = useCallback(() => {
      axios.post(serverUrl + 'service/getRackets',{userRole, userId})
      .then(function (response){
         var td = response.data;
         var tempD = [];
         for(var i = 0 ; i < td.length; i++){
            if(td[i].Racket !== null){
               tempD.push(td[i]);
            }
         }
         setData(tempD);
      })
      .catch(function (error){
         console.log(error);
      })
   },[userRole, userId]);

   useEffect(() => {
      getRackets();
   },[getRackets])

   return (
      <div className={classes.root}>
         <Card className={classes.cardRoot}>
            <MaterialTable
               title={t('Racket.label')}
               columns={columns}
               data={data}
               options={{
                  search: false,
                  filtering: true,
                  sorting: true,
                  pageSize: 10,
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
               onRowUpdate: (newData, oldData) =>
                  new Promise((resolve) => {
                     setTimeout(() => {
                     resolve();
                     if (oldData) {
                        const newRacketData = {...newData};
                        axios.post(serverUrl + 'service/updateRacket',{
                           racketInfo: newRacketData.Racket
                        })
                        .then(function (response){
                           getRackets();
                        })
                     }
                     }, 600);
                  }),
               onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                     setTimeout(() => {
                     resolve();
                     axios.post(serverUrl + 'service/deleteRacket',{
                        racketId: oldData.Racket.id
                     })
                     .then(function (response){
                        getRackets();
                     });
                     }, 600);
                     
                  }),
               } : {
                  onRowUpdate: (newData, oldData) =>
                  new Promise((resolve) => {
                     setTimeout(() => {
                     resolve();
                     if (oldData) {
                        const newRacketData = {...newData};
                        axios.post(serverUrl + 'service/updateRacket',{
                           racketInfo: newRacketData.Racket
                        })
                        .then(function (response){
                           getRackets();
                        })
                     }
                     }, 600);
                  })
               }}
            />
         </Card>
      </div>
   );
}