//React
import React, { Fragment, useState } from 'react'

//MUI
import { Button, Dialog, DialogActions, DialogTitle, Divider, Grid, TextField, Switch, MenuItem, Select, Slider, Typography, Container, IconButton } from '@mui/material'
import { makeStyles } from '@mui/styles';

//Icon
import SettingsIcon from '@material-ui/icons/Settings';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(() => ({
    settingsButton: {
        backgroundColor: "rgba(255,255,255,0.2)",
        color: "#fff",
        fontSize: "13px"
    },
    dialogPaper: {
        maxHeight: "none",
        maxWidth:"480px"
    },
    numberInputs: {
        backgroundColor: "gray"
    },
    dialogContent: {
        marginTop: "10px"
    },
    container: {
        display: 'flex',
        justifyContent: 'center'
    },
    gridContainer: {
        paddingTop: "20px"
    }
}));

export default function Settings(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const { pomodoroSettings : { pomodoro , shortBreak, longBreak, autoStarts, longBreakInterval, alarmSound, alarmVolume, alarmRepeat, tickingSound, tickingVolume }, setpomodoroSettings } = props;

    const handleClose = () => {
        setOpen(false);
    }

    const handleAutoStarts = (e) => {
        setpomodoroSettings({...props.pomodoroSettings, autoStarts : {...autoStarts, [e.target.name]: e.target.checked} });
    }

    return (
        <Fragment>
            <Button className={classes.settingsButton} variant="contained" size="small" disableElevation startIcon={<SettingsIcon />} onClick={() => setOpen(true)}>Settings</Button>
            <Dialog open={open} onClose={handleClose} PaperProps={{ classes: { root: classes.dialogPaper } }}>
                <Container className={classes.container}>
                    <Grid container spacing={2} justifyContent='center' className={classes.gridContainer}>
                        <Grid container item justifyContent="space-between" alignItems="center">
                            <Grid item xs={7}>
                                <DialogTitle style={{ padding: 0 }}>Timer Setting</DialogTitle>
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton onClick={handleClose}>
                                    <CloseIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                        </Grid>
                        <Grid container item spacing={2} justifyContent="space-between" xs={12}>
                            <Grid item xs={10}>
                                <Typography variant="body1">Time</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField size="small" type="number" label="Pomodoro" value={Math.floor(pomodoro.initValue / 60)} variant="outlined" onChange={(e) => setpomodoroSettings({...props.pomodoroSettings, pomodoro : e.target.value >= 5? {initValue : e.target.value * 60, currentValue : e.target.value * 60} : pomodoro})} />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField size="small" type="number" label="Short break" value={Math.floor(shortBreak.initValue / 60)} variant="outlined" onChange={(e) => setpomodoroSettings({...props.pomodoroSettings, shortBreak : e.target.value >= 1? {initValue : e.target.value * 60, currentValue : e.target.value * 60} : shortBreak})} />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField size="small" type="number" label="Long Break" value={Math.floor(longBreak.initValue / 60)} variant="outlined" onChange={(e) => setpomodoroSettings({...props.pomodoroSettings, longBreak : e.target.value >= 1? {initValue : e.target.value * 60, currentValue : e.target.value * 60} : longBreak})} />
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                        </Grid>
                        <Grid container item spacing={2} justifyContent="space-between" alignItems="center" xs={12}>
                            <Grid item xs={8}>
                                <Typography variant="body1">Auto start breaks?</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Switch checked={autoStarts.break} onChange={handleAutoStarts} name="break" />
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                        </Grid>
                        <Grid container item spacing={2} justifyContent="space-between" alignItems="center" xs={12}>
                            <Grid item xs={8}>
                                <Typography variant="body1">Auto start Pomodoros?</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Switch checked={autoStarts.pomodoro} onChange={handleAutoStarts} name="pomodoro" />
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                        </Grid>
                        <Grid container item spacing={2} justifyContent="space-between" alignItems="center" xs={12}>
                            <Grid item xs={6}>
                                <Typography variant="body1">Long break interval</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField type="number" size="small" variant="outlined" value={longBreakInterval} onChange={(e) => setpomodoroSettings({...props.pomodoroSettings, longBreakInterval : e.target.value >= 1? e.target.value : longBreakInterval})} />
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                        </Grid>
                        <Grid container item spacing={2} justifyContent="space-between" alignItems="center" xs={12}>
                            <Grid item xs={6}>
                                <Typography variant="body1">Alarm sound</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Select variant="outlined" size="small" value={alarmSound} onChange={(e) => setpomodoroSettings({...props.pomodoroSettings, alarmSound : e.target.value})}>
                                    <MenuItem value="wood">Wood</MenuItem>
                                    <MenuItem value="bell">Bell</MenuItem>
                                    <MenuItem value="bird">Bird</MenuItem>
                                    <MenuItem value="digital">Digital</MenuItem>
                                    <MenuItem value="kitchen">Kitchen</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                        <Grid container item spacing={2} justifyContent="flex-end" alignItems="center" xs={12}>
                            <Grid item xs={1}>
                                <Typography variant="body1">{alarmVolume}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Slider min={0} max={100} value={alarmVolume} onChange={(e, newValue) => setpomodoroSettings({...props.pomodoroSettings, alarmVolume : newValue})} />
                            </Grid>
                            <Grid item xs={12} />
                            <Grid item xs={2}>
                                <Typography variant="body1">repeat</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField type="number" size="small" variant="outlined" value={alarmRepeat} onChange={(e) => setpomodoroSettings({...props.pomodoroSettings, alarmRepeat : e.target.value >= 1? e.target.value : alarmRepeat})} />
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                        </Grid>
                        <Grid container item spacing={2} justifyContent="space-between" alignItems="center" xs={12}>
                            <Grid item xs={6}>
                                <Typography variant="body1">Ticking sound</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Select variant="outlined" size="small" value={tickingSound} onChange={(e) => setpomodoroSettings({...props.pomodoroSettings, tickingSound : e.target.value})}>
                                    <MenuItem value="none">None</MenuItem>
                                    <MenuItem value="tickingFast">Ticking fast</MenuItem>
                                    <MenuItem value="tickingSlow">Ticking slow</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                        <Grid container item spacing={2} justifyContent="flex-end" alignItems="center" xs={12}>
                            <Grid item xs={1}>
                                <Typography variant="body1">{tickingVolume}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Slider min={0} max={100} value={tickingVolume} onChange={(e, newValue) => setpomodoroSettings({...props.pomodoroSettings, tickingVolume : newValue})} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}
