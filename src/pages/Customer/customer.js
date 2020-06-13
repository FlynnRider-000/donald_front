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
      { title: t('FirstName.label'), field: 'firstName' },
      { title: t('LastName.label'), field: 'lastName' },
      { title: t('Street.label'), field: 'street' },
      { title: t('Number.label'), field: 'number', type: 'numeric' },
      { title: t('ZIPcode.label'), field: 'ZIPcode', type: 'numeric' },
      { title: t('City.label'), field: 'city'},
      { title: t('SportsClub.label'), field: 'sportsClub'},
      { title: t('Email.label'), field: 'eMail'},
      { title: t('Phone.label'), field: 'phone'}
   ];

   const [data, setData] = React.useState([]);

   const userRole = useSelector(state => state.user.userRole);
   const userId = useSelector(state => state.user.userId);

   const getCustomers = useCallback(() => {
      axios.post(serverUrl + 'service/getCustomers',{userRole, userId})
      .then(function (response){
         setData(response.data);
      })
      .catch(function (error){
         console.log(error);
      })
   },[userRole, userId]);

   useEffect(() => {
      getCustomers();
   },[getCustomers])

   return (
      <div className={classes.root}>
         <Card className={classes.cardRoot}>
            <MaterialTable
               title={t('Customer.label')}
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
               editable={{
               onRowUpdate: (newData, oldData) =>
                  new Promise((resolve) => {
                     setTimeout(() => {
                     resolve();
                     if (oldData) {
                        const newUserData = {...newData};
                        newUserData.id = data[data.indexOf(oldData)].id;
                        axios.post(serverUrl + 'service/updateCustomer',{
                           customerInfo: newUserData
                        })
                        .then(function (response){
                           getCustomers();
                        })
                     }
                     }, 600);
                  }),
               onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                     setTimeout(() => {
                     resolve();
                     axios.post(serverUrl + 'service/deleteCustomer',{
                        customerId: data[data.indexOf(oldData)].id
                     })
                     .then(function (response){
                        getCustomers();
                     })
                     }, 600);
                  }),
               }}
            />
         </Card>
      </div>
   );
}