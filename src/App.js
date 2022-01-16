import './App.css';

// MUI
import { Button, Tab, Tabs, Typography, Paper, Container, Grid } from '@mui/material';

import { makeStyles, useTheme } from '@mui/styles'

// Local imports 
import Tasks from "./components/Tasks";
import Settings from "./components/Settings";
import TabPanel from './components/TabPanel';
import { CustomThemeContext } from './themes/CustomThemeProvider';
import audioURLs from './utils/audioHandle';
import { audioTicking, playAudio } from './utils/audioHandle';
import styles from './themes/styles';

//React
import { useState, useEffect, useContext, useRef } from 'react';

//Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const useStyles = makeStyles((theme) => styles(theme));

function App() {
    const theme = useTheme();
    const context = useContext(CustomThemeContext);
    const classes = useStyles();
    const [start, setstart] = useState(false)
    const [pomodoroSettings, setpomodoroSettings] = useState({
        currentTab: 0,
        timers: [60, 60, 60], //pomodoro, shortBreak, longBreak in seconds
        timer: 60,
        longBreakInterval: { initValue: 2, currentValue: 2 },
        autoStarts: {
            break: false,
            pomodoro: false
        },
        alarmSoundIndex: "0",
        alarmVolume: 0.5,
        alarmRepeat: 1,
        tickingSoundIndex: "0",
        tickingVolume: 0.5
    });
    const [pomodoroCounter, setPomodoroCounter] = useState(1);
    const [appBarTimerWidth, setAppBarTimerWidth] = useState(0);
    const audioAlarmRef = useRef();
    const audioTickingRef = useRef();

    const handleChange = (e, newValue) => {
        setpomodoroSettings({ ...pomodoroSettings, currentTab: newValue, timer: pomodoroSettings.timers[newValue] })
        setAppBarTimerWidth(0);
        context.setTheme(newValue);
        setstart(false);
    }

    const handleStartStop = () => {
        if (!start) {
            audioTickingRef.current.src = audioTicking[pomodoroSettings.tickingSoundIndex];
            audioTickingRef.current.currentTime = 0;
            audioTickingRef.current.play();
            audioAlarmRef.current.pause();
            audioAlarmRef.current.currentTime = 0;
        } else
            audioTickingRef.current.pause();
        setstart(!start);
        context.setShadows(start);
    }

    const tabProps = (index) => ({
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
        style: {
            backgroundColor: pomodoroSettings.currentTab === index ? theme.palette.primary.dark : 'transparent',
            transition: theme.transitions.create(["background-color", "transform"], { duration: 1000 })
        }
    });

    useEffect(() => { // Handle themes and timers given the current timer decremented every second with setInterval
        if (start) {
            let interval = setInterval(() => {
                if (pomodoroSettings.timer === 0) {
                    audioTickingRef.current.pause();
                    audioTickingRef.current.currentTime = 0;
                    setAppBarTimerWidth(0);
                    context.setShadows(start);
                    if (pomodoroSettings.currentTab === 0) {
                        if (!pomodoroSettings.autoStarts.break) 
                            setstart(!start);
                        setPomodoroCounter(pomodoroCounter + 1);
                        if (pomodoroSettings.longBreakInterval.currentValue === 1) {
                            setpomodoroSettings({ ...pomodoroSettings, timer: pomodoroSettings.timers[2], currentTab: 2, longBreakInterval: { ...pomodoroSettings.longBreakInterval, currentValue: pomodoroSettings.longBreakInterval.initValue } })
                            context.setTheme(2);
                        } else {
                            setpomodoroSettings({ ...pomodoroSettings, timer: pomodoroSettings.timers[1], longBreakInterval: { ...pomodoroSettings.longBreakInterval, currentValue: pomodoroSettings.longBreakInterval.currentValue - 1 }, currentTab: 1 })
                            context.setTheme(1);
                        }
                    } else {
                        if (!pomodoroSettings.autoStarts.pomodoro) 
                            setstart(!start);
                        setpomodoroSettings({ ...pomodoroSettings, timer: pomodoroSettings.timers[0], currentTab: 0 })
                        context.setTheme(0);
                    }
                    playAudio(audioAlarmRef, pomodoroSettings.alarmSoundIndex, audioURLs, pomodoroSettings.alarmRepeat);
                } else {
                    setpomodoroSettings({ ...pomodoroSettings, timer: pomodoroSettings.timer - 1 })
                    setAppBarTimerWidth(100 - ((pomodoroSettings.timer - 1) / pomodoroSettings.timers[pomodoroSettings.currentTab]) * 100);
                }
            }, 50);

            return () => {
                clearInterval(interval);
            }
        }
    }, [start, pomodoroSettings, context, pomodoroCounter]);

    return (
        <Container className={classes.root}>
            <audio ref={audioAlarmRef} />
            <audio ref={audioTickingRef} loop />
            <Container className={classes.subRoot}>
                <Grid container justifyContent="center" style={{ marginBottom: "30px" }}>
                    <Grid item container className={classes.appBar}>
                        <Grid item style={{ display: "flex" }}>
                            <CheckCircleIcon />
                            <Typography variant="h6">Pomofocus</Typography>
                        </Grid>
                        <Settings pomodoroSettings={pomodoroSettings} setpomodoroSettings={setpomodoroSettings} />
                    </Grid>
                    <Grid item xs={12} style={{ height: "1px", backgroundColor: "rgba(0,0,0,0.1)" }}>
                        <div style={{ height: "3px", width: `${appBarTimerWidth}%`, backgroundColor: "white", borderRadius: "7px" }} />
                    </Grid>
                </Grid>
                <Paper className={classes.paperPomodoro} elevation={0}>
                    <Tabs value={pomodoroSettings.currentTab} className={classes.tabContainer} centered onChange={handleChange} aria-label="Pomodoro tabs" textColor="inherit" TabIndicatorProps={{ style: { display: "none" } }}>
                        <Tab className={classes.tabs} label="Pomodoro" {...tabProps(0)} />
                        <Tab className={classes.tabs} label="Short Break" {...tabProps(1)} />
                        <Tab className={classes.tabs} label="Long Break" {...tabProps(2)} />
                    </Tabs>
                    {
                        pomodoroSettings.timers.map((_, i) => (
                            <TabPanel key={i} currentTab={pomodoroSettings.currentTab} index={i} timer={pomodoroSettings.timer} />
                        ))
                    }
                    <Button variant="contained" className={classes.startButton} disableElevation onClick={handleStartStop}>{start ? 'Stop' : 'Start'}</Button>
                </Paper>
                <Tasks timer={pomodoroSettings.timer} timers={pomodoroSettings.timers} longBreakInterval={pomodoroSettings.longBreakInterval} currentTab={pomodoroSettings.currentTab} pomodoroCounter={pomodoroCounter} />
            </Container >
        </Container>
    );
}

export default App;
