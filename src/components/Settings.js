//React
import React, { Fragment, useState, useEffect, useRef } from 'react'

//MUI
import { Button, Dialog, DialogActions, DialogTitle, Divider, Grid, TextField, Switch, MenuItem, Select, Slider, Typography, Container, IconButton } from '@mui/material'
import { makeStyles } from '@mui/styles';

//Icon
import SettingsIcon from '@material-ui/icons/Settings';
import CloseIcon from '@material-ui/icons/Close';

//Local
import audioURLs from '../utils/audioHandle';
import { audioTicking, useAudio } from '../utils/audioHandle';
import styles from '../themes/styles';

const useStyles = makeStyles((theme) => styles(theme));

function Settings(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const audioAlarmRef = useRef();
    const audioTickingRef = useRef();

    const { pomodoroSettings: { currentTab, timers, timer, autoStarts, longBreakInterval, alarmSoundIndex, alarmVolume, alarmRepeat, tickingSoundIndex, tickingVolume }, setpomodoroSettings } = props;

    const handleClose = () => {
        audioAlarmRef.current.pause();
        audioTickingRef.current.pause();
        setOpen(false);
    }

    const handleAutoStarts = (e) => {
        setpomodoroSettings({ ...props.pomodoroSettings, autoStarts: { ...autoStarts, [e.target.name]: e.target.checked } });
    }

    useAudio(audioAlarmRef, alarmSoundIndex, alarmVolume, audioURLs);
    useAudio(audioTickingRef, tickingSoundIndex, tickingVolume, audioTicking);

    return (
        <Fragment>
            <audio ref={audioAlarmRef} />
            <audio ref={audioTickingRef} loop />
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
                            {
                                timers.map((oneTimer, i) => (
                                    <Grid key={i} item xs={4}>
                                        <TextField size="small" type="number" label={i === 0 ? "Pomodoro" : i === 1 ? "Short Break" : "Long Break"} value={Math.floor(oneTimer / 60)} variant="outlined" onChange={(e) => { let tmpTimers = [...timers]; tmpTimers[i] = e.target.value >= 1 ? e.target.value * 60 : oneTimer; setpomodoroSettings({ ...props.pomodoroSettings, timers: tmpTimers, timer: currentTab === i ? e.target.value * 60 : timer }) }} />
                                    </Grid>
                                ))
                            }
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
                                <TextField type="number" size="small" variant="outlined" value={longBreakInterval.initValue} onChange={(e) => setpomodoroSettings({ ...props.pomodoroSettings, longBreakInterval: e.target.value >= 1 ? { initValue: parseInt(e.target.value), currentValue: parseInt(e.target.value) } : longBreakInterval })} />
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                        </Grid>
                        <Grid container item spacing={2} justifyContent="space-between" alignItems="center" xs={12}>
                            <Grid item xs={5}>
                                <Typography variant="body1">Alarm sound</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Select variant="outlined" style={{ width: "140px", boxSizing: "border-box" }} size="small" value={alarmSoundIndex} onChange={(e) => { setpomodoroSettings({ ...props.pomodoroSettings, alarmSoundIndex: e.target.value }) }}>
                                    <MenuItem value="0">Medium Bell</MenuItem>
                                    <MenuItem value="1">CowBell</MenuItem>
                                    <MenuItem value="2">Dinner Bell</MenuItem>
                                    <MenuItem value="3">Alarm Clock</MenuItem>
                                    <MenuItem value="4">Owl</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                        <Grid container item spacing={2} justifyContent="flex-end" alignItems="center" xs={12}>
                            <Grid item xs={1}>
                                <Typography variant="body1">{alarmVolume * 100}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Slider min={0} max={100} value={alarmVolume * 100} onChange={(e, newValue) => setpomodoroSettings({ ...props.pomodoroSettings, alarmVolume: newValue / 100 })} />
                            </Grid>
                            <Grid item xs={12} />
                            <Grid item xs={2}>
                                <Typography variant="body1">repeat</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField type="number" size="small" variant="outlined" value={alarmRepeat} onChange={(e) => setpomodoroSettings({ ...props.pomodoroSettings, alarmRepeat: e.target.value >= 1 ? parseInt(e.target.value) : alarmRepeat })} />
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
                                <Select style={{ width: "140px" }} variant="outlined" size="small" value={tickingSoundIndex} onChange={(e) => setpomodoroSettings({ ...props.pomodoroSettings, tickingSoundIndex: e.target.value })}>
                                    <MenuItem value="0">Ticking slow</MenuItem>
                                    <MenuItem value="1">Ticking fast</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                        <Grid container item spacing={2} justifyContent="flex-end" alignItems="center" xs={12}>
                            <Grid item xs={1}>
                                <Typography variant="body1">{tickingVolume * 100}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Slider min={0} max={100} value={tickingVolume * 100} onChange={(e, newValue) => setpomodoroSettings({ ...props.pomodoroSettings, tickingVolume: newValue / 100 })} />
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

export default Settings;