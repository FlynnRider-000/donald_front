import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogContent, DialogTitle, Divider, DialogActions, Button} from '@material-ui/core';


import { useTranslation } from 'react-i18next'


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
    fontSize: '20px !important',
    fontWeight: 'bold',
  },
  dlgSubTitle: {
    fontSize: '18px !important',
    fontWeight: 'bold',
  },
  dlgContent: {
    fontSize: '17px',
    lineHeight: '1.7em'
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
    const { opened, onClose} = props;
    const { t } = useTranslation();

    return (
        <React.Fragment>
        <Dialog
            fullWidth={true}
            maxWidth="sm"
            open={opened}
            onClose={onClose}
            aria-labelledby="max-width-dialog-title"
        >
            <DialogTitle id="max-width-dialog-title">
              <div className={classes.dlgTitle}>{t('TermsContentHeader.label')}</div>
            </DialogTitle>
            <Divider/>
            <DialogContent>
                <div className={classes.dlgSubTitle}>
                {t('TermsContentSubHeader.label')}
                </div>
                <div className={classes.dlgContent}>
                  {t('TermsContent.label')}
                </div>
            </DialogContent>    
            <DialogActions>
                <Button onClick={onClose}>{t('Close.label')}</Button>
            </DialogActions>
        </Dialog>
        </React.Fragment>
    );
}