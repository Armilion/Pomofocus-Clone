import './App.css';

// MUI
import { Button, Tab, Tabs, Typography, Paper, Container, Grid } from '@mui/material';

import { makeStyles, ThemeProvider, useTheme } from '@mui/styles'

// Local imports 
import Task from "./components/Task";
import Settings from "./components/Settings";
import TabPanel from './components/TabPanel';
import { CustomThemeContext } from './themes/CustomThemeProvider';
import audioURLs from './utils/audioURLs';

import pomodoroTheme from './themes/pomodoroTheme';
import shortBreakTheme from './themes/shortBreakTheme';
import longBreakTheme from './themes/longBreakTheme';

//React
import { useState, useEffect, useContext, useRef } from 'react';

//Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const useStyles = makeStyles((theme) => ({
    root: {
        justifyContent: "center",
        backgroundColor: theme.palette.primary.main,
        transition: theme.transitions.create(['background-color', 'transform'], { duration: 1000 }),
        maxWidth: "unset",
        height: "100vh",
        color: "#fff",
        '& button': {
            textTransform: 'capitalize'
        }
    },
    subRoot: {
        maxWidth: "600px"
    },
    appBar: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: "10px",
        paddingBottom: "10px",
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "480px",
        padding: "20px",
        margin: "20px",
        backgroundColor: "rgba(255,255,200,0.2)",
        color: "white"
    },
    startButton: {
        textTransform: 'uppercase !important',
        fontWeigh: 'bold',
        width: "200px",
        fontSize: "22px",
        backgroundColor: "white",
        boxShadow: theme.shadows[25],
        color: `${theme.palette.primary.main}`,
        '&:hover': {
            backgroundColor: "white",
            boxShadow: theme.shadows[25]
        }
    },
    tabs: {
        borderRadius: "5px",
        padding: "7px",
        minHeight: "unset",
        margin: "0 10px 0 10px"
    },
    tabContainer: {
        width: "100%",
        '& .css-1wf8b0h-MuiTabs-flexContainer': {
            justifyContent: "center"
        }
    }
}));

const themes = [
    pomodoroTheme,
    shortBreakTheme,
    longBreakTheme
];

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
        alarmRepeat: 4,
        tickingSound: "none",
        tickingVolume: 50
    });
    const [appBarTimerWidth, setAppBarTimerWidth] = useState(0);
    const audioRef = useRef();

    const playAudio = () => {
        const ref = audioRef.current;
        ref.src = audioURLs[parseInt(pomodoroSettings.alarmSoundIndex)];
        ref.play();
        setTimeout(() => {
            ref.pause();
            ref.currentTime = 0;
        }, 10000);

    }

    const handleChange = (e, newValue) => {
        setpomodoroSettings({ ...pomodoroSettings, currentTab: newValue, timer: pomodoroSettings.timers[newValue] })
        setAppBarTimerWidth(0);
        context.setTheme(newValue);
        setstart(false);
    }

    const handleStartStop = () => {
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

    useEffect(() => {
        if (start) {
            let interval = setInterval(() => {
                if (pomodoroSettings.timer === 0) {
                    setAppBarTimerWidth(0);
                    handleStartStop();
                    if (pomodoroSettings.currentTab === 0) {
                        if (pomodoroSettings.longBreakInterval.currentValue === 1) {
                            setpomodoroSettings({ ...pomodoroSettings, timer: pomodoroSettings.timers[2], currentTab: 2, longBreakInterval: { ...pomodoroSettings.longBreakInterval, currentValue: pomodoroSettings.longBreakInterval.initValue } })
                            context.setTheme(2);
                        } else {
                            setpomodoroSettings({ ...pomodoroSettings, timer: pomodoroSettings.timers[1], longBreakInterval: { ...pomodoroSettings.longBreakInterval, currentValue: pomodoroSettings.longBreakInterval.currentValue - 1 }, currentTab: 1 })
                            context.setTheme(1);
                        }
                    } else {
                        setpomodoroSettings({ ...pomodoroSettings, timer: pomodoroSettings.timers[0], currentTab: 0 })
                        context.setTheme(0);
                    }
                    playAudio();
                } else {
                    setpomodoroSettings({ ...pomodoroSettings, timer: pomodoroSettings.timer - 1 })
                    setAppBarTimerWidth(100 - ((pomodoroSettings.timer - 1) / pomodoroSettings.timers[pomodoroSettings.currentTab]) * 100);
                }

                /* handleStartStop();
            } else {
                setpomodoroSettings({ ...pomodoroSettings, pomodoro: { ...pomodoroSettings.pomodoro, currentValue: pomodoroSettings.pomodoro.currentValue - 1
            } })
    setAppBarTimerWidth(100 - ((pomodoroSettings.pomodoro.currentValue - 1) / pomodoroSettings.pomodoro.initValue) * 100);
}

if (pomodoroSettings.currentTab === 0) {
    if (pomodoroSettings.pomodoro.currentValue === 0) {
        setAppBarTimerWidth(0);
        playAudio(pomodoroSettings.alarmSoundIndex);
        if (pomodoroSettings.longBreakInterval.currentValue === 1) {
            setpomodoroSettings({ ...pomodoroSettings, pomodoro: { initValue: pomodoroSettings.pomodoro.initValue, currentValue: pomodoroSettings.pomodoro.initValue }, currentTab: 2 })
            context.setTheme(2);
        } else {
            setpomodoroSettings({ ...pomodoroSettings, pomodoro: { initValue: pomodoroSettings.pomodoro.initValue, currentValue: pomodoroSettings.pomodoro.initValue }, longBreakInterval: { ...pomodoroSettings.longBreakInterval, currentValue: pomodoroSettings.longBreakInterval.currentValue - 1 }, currentTab: 1 })
            context.setTheme(1);
        }
        handleStartStop();
    } else {
        setpomodoroSettings({ ...pomodoroSettings, pomodoro: { ...pomodoroSettings.pomodoro, currentValue: pomodoroSettings.pomodoro.currentValue - 1 } })
        setAppBarTimerWidth(100 - ((pomodoroSettings.pomodoro.currentValue - 1) / pomodoroSettings.pomodoro.initValue) * 100);
    }
} else if (pomodoroSettings.currentTab === 1) {
    if (pomodoroSettings.shortBreak.currentValue === 0) {
        playAudio(pomodoroSettings.alarmSoundIndex);
        setAppBarTimerWidth(0);
        setpomodoroSettings({ ...pomodoroSettings, shortBreak: { initValue: pomodoroSettings.shortBreak.initValue, currentValue: pomodoroSettings.shortBreak.initValue }, currentTab: 0 })
        context.setTheme(0);
        handleStartStop();
    } else {
        setpomodoroSettings({ ...pomodoroSettings, shortBreak: { ...pomodoroSettings.shortBreak, currentValue: pomodoroSettings.shortBreak.currentValue - 1 } })
        setAppBarTimerWidth(100 - ((pomodoroSettings.shortBreak.currentValue - 1) / pomodoroSettings.shortBreak.initValue) * 100);
    }
} else if (pomodoroSettings.currentTab === 2) {
    if (pomodoroSettings.longBreak.currentValue === 0) {
        playAudio(pomodoroSettings.alarmSoundIndex);
        setAppBarTimerWidth(0);
        setpomodoroSettings({ ...pomodoroSettings, longBreak: { initValue: pomodoroSettings.longBreak.initValue, currentValue: pomodoroSettings.longBreak.initValue }, longBreakInterval: { initValue: pomodoroSettings.longBreakInterval.initValue, currentValue: pomodoroSettings.longBreakInterval.initValue }, currentTab: 0 })
        context.setTheme(0);
        handleStartStop();
    } else {
        setpomodoroSettings({ ...pomodoroSettings, longBreak: { ...pomodoroSettings.longBreak, currentValue: pomodoroSettings.longBreak.currentValue - 1 } })
        setAppBarTimerWidth(100 - ((pomodoroSettings.longBreak.currentValue - 1) / pomodoroSettings.longBreak.initValue) * 100);
    } 
}*/
            }, 50);

            return () => {
                clearInterval(interval);
            }
        }
    }, [start, pomodoroSettings])

    return (
        <ThemeProvider theme={themes[pomodoroSettings.currentTab]}>
            <Container className={classes.root}>
                <audio ref={audioRef} />
                <Container className={classes.subRoot}>
                    <Grid container justifyContent="center">
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
                    <Paper className={classes.paper} elevation={0}>
                        <Tabs value={pomodoroSettings.currentTab} className={classes.tabContainer} centered onChange={handleChange} aria-label="Pomodoro tabs" textColor="inherit" TabIndicatorProps={{ style: { display: "none" } }}>
                            <Tab className={classes.tabs} label="Pomodoro" {...tabProps(0)} />
                            <Tab className={classes.tabs} label="Short Break" {...tabProps(1)} />
                            <Tab className={classes.tabs} label="Long Break" {...tabProps(2)} />
                        </Tabs>
                        {
                            pomodoroSettings.timers.map((oneTimer, i) => (
                                <TabPanel key={i} currentTab={pomodoroSettings.currentTab} index={i} timer={pomodoroSettings.timer} />
                            ))
                        }
                        <Button variant="contained" className={classes.startButton} disableElevation onClick={handleStartStop}>{start ? 'Stop' : 'Start'}</Button>
                    </Paper>
                    <Task timer={pomodoroSettings.timer} />
                </Container >
            </Container >
        </ThemeProvider>
    );
}

export default App;
