import React,{ useEffect, useCallback } from 'react';

import MaterialTable from 'material-table';
import { default as pageStyle } from './style';

import { useTranslation } from 'react-i18next'

import {
   Card
} from '@material-ui/core';

import { serverUrl } from '../../api/serverUrl';
const axios = require('axios');

export default function MaterialTableDemo() {
   const classes = pageStyle();
   const { t } = useTranslation()

   const columns = [
      { title: t('UserName.label'), field: 'userName' },
      { title: t('FirstName.label'), field: 'firstName' },
      { title: t('LastName.label'), field: 'lastName' },
      { title: t('Street.label'), field: 'street' },
      { title: t('Number.label'), field: 'number', type: 'numeric', headerStyle: {textAlign:'left', flexDirection:'row'}, cellStyle: {textAlign:'left'},},
      { title: t('ZIPcode.label'), field: 'ZIPcode', type: 'numeric', headerStyle: {textAlign:'left', flexDirection:'row'}, cellStyle: {textAlign:'left'},},
      { title: t('City.label'), field: 'city'},
      { title: t('SportsClub.label'), field: 'sportsClub'},
      { title: t('Email.label'), field: 'eMail'},
      { title: t('Phone.label'), field: 'phone'},
      { title: t('Role.label'), field: 'role', lookup: { 0: 'Admin', 1: 'Agent' } },
   ];

   const [data, setData] = React.useState([]);

   const getUsers = useCallback(() => {
      axios.post(serverUrl + 'user/getUsers')
      .then(function (response){
         setData(response.data);
      })
      .catch(function (error){
         console.log(error);
      })
   },[]);

   useEffect(() => {
      getUsers();
   },[getUsers])

   return (
      <div className={classes.root}>
         <Card className={classes.cardRoot}>
            <MaterialTable
               title={t('UserTable.label')}
               columns={columns}
               data={data}
               options={{
                  search: false,
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
               onRowAdd: (newData) =>
                  new Promise((resolve) => {
                     setTimeout(() => {
                     resolve();
                     axios.post(serverUrl + 'user/addUser',{
                        userInfo: newData
                     })
                     .then(function (response){
                        getUsers();
                     })
                     }, 600);
                  }),
               onRowUpdate: (newData, oldData) =>
                  new Promise((resolve) => {
                     setTimeout(() => {
                     resolve();
                     if (oldData) {
                        const newUserData = {...newData};
                        newUserData.id = data[data.indexOf(oldData)].id;
                        axios.post(serverUrl + 'user/updateUser',{
                           userInfo: newUserData
                        })
                        .then(function (response){
                           getUsers();
                        })
                     }
                     }, 600);
                  }),
               onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                     setTimeout(() => {
                     resolve();
                     axios.post(serverUrl + 'user/deleteUser',{
                        userId: data[data.indexOf(oldData)].id
                     })
                     .then(function (response){
                        getUsers();
                     })
                     }, 600);
                  }),
               }}
            />
         </Card>
      </div>
   );
}