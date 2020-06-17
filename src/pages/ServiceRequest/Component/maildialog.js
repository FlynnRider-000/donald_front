import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogContent, DialogTitle, Divider, Table,TableRow,TableBody,TableCell, DialogActions, Button} from '@material-ui/core';


import { useTranslation } from 'react-i18next'

import { useSelector } from 'react-redux'

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
    const { opened, onSend, onClose, data, type} = props;
    const { t } = useTranslation();
    
    const getDateFormat = (m_date) => {
        var temp = new Date(m_date);
        var res = "";
        res += (temp.getDate() < 10 ? "0" + temp.getDate() : temp.getDate());
        res += "/"
        res += ((temp.getMonth() + 1) < 10 ? "0" + (temp.getMonth() + 1) : (temp.getMonth() + 1));
        res += "/"
        res += temp.getFullYear();
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
    
    const userId = useSelector(state => state.user.userId);
    
    const toClient = data.Customer !== undefined ? ("'" + data.Customer.firstName + " " + data.Customer.lastName + "'") : "";
    const toAgent = data.User !== undefined ? ("'" + data.User.firstName + " " + data.User.lastName + "'") : "";
    const racketInfo = data.Racket !== undefined ? (data.Racket.Brand + " " + data.Racket.Name) : "";
    const location = data.location !== undefined ? (data.location) : "";
    const dateInfo = data.confPickTime !== undefined ? getDateFormat(data.confPickTime) : "";
    const timeInfo = data.confPickTime !== undefined ? getTimeFormat(data.confPickTime) : "";

    const MailInfo = type === 1 ? {
        from: userId,
        to: data.agentId,
        subject : "Der Schläger von " + toClient.slice(1,-1) + " ist fertig",
        text : "Der " + racketInfo + " ist fertig und wird am " + dateInfo + " um " +  timeInfo + " Uhr an folgendem Ort bereitliegen: " + location + "\n--\nDonald Schulz Sport\nWiesenstrasse 16\n37073 Göttingen\n0551-77344\n"
    }: {
        from: userId,
        to: data.Customer !== undefined ? data.Customer.id : -1,
        subject : "Dein Schläger ist besaitet.",
        text: "Hallo " + toClient.slice(1,-1) + ",\ndein " + racketInfo + " ist fertig besaitet und kann am " + dateInfo + " um " + timeInfo + " Uhr an folgendem Ort  abgeholt werden: " + location + "\nMit Gruß DSS\n--\nDonald Schulz Sport\nWiesenstrasse 16\n37073 Göttingen\n0551-77344"
    };

    const onSubmit = () => {
        onSend(MailInfo);
    }

    return (
        <React.Fragment>
        <Dialog
            fullWidth={true}
            maxWidth="md"
            open={opened}
            onClose={onClose}
            aria-labelledby="max-width-dialog-title"
        >
            <DialogTitle id="max-width-dialog-title">
                <div className={classes.dlgTitle}>{t('mailconfirm.label') + (type ? toAgent : toClient)}</div>
            </DialogTitle>
            <Divider/>
            <DialogContent>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                {t('MailSubject.label')}
                            </TableCell>
                            <TableCell>
                                {MailInfo.subject}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                {t('MailBody.label')}
                            </TableCell>
                            <TableCell>
                                {MailInfo.text.split("\n").map((val,index) => (
                                    <div key={index}>{val}</div>
                                ))}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </DialogContent>
            <DialogActions>
                <Button onClick={onSubmit} type = "submit">{t('MailSend.label')}</Button>
                <Button onClick={onClose}>{t('MailCancel.label')}</Button>
            </DialogActions>
        </Dialog>
        </React.Fragment>
    );
}