import './App.css';

// MUI
import { Button, Tab, Tabs, Typography, Paper, Container, Grid } from '@mui/material';

import { makeStyles, ThemeProvider, useTheme } from '@mui/styles'

// Local imports 
import Task from "./components/Task";
import Settings from "./components/Settings";
import TabPanel from './components/TabPanel';
import { CustomThemeContext } from './themes/CustomThemeProvider';

import pomodoroTheme from './themes/pomodoroTheme';
import shortBreakTheme from './themes/shortBreakTheme';
import longBreakTheme from './themes/longBreakTheme';

//React
import { useState, useEffect, useContext } from 'react';

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
        pomodoro: { initValue: 60, currentValue: 60 },
        shortBreak: { initValue: 60, currentValue: 60 },
        longBreak: { initValue: 60, currentValue: 60 },
        longBreakInterval: { initValue: 2, currentValue: 2 },
        autoStarts: {
            break: false,
            pomodoro: false
        },
        alarmSound: "wood",
        alarmVolume: 50,
        alarmRepeat: 4,
        tickingSound: "none",
        tickingVolume: 50
    });
    const [appBarTimerWidth, setAppBarTimerWidth] = useState(0);

    const handleChange = (e, newValue) => {
        if (pomodoroSettings.currentTab === 0) {
            setpomodoroSettings({ ...pomodoroSettings, currentTab: newValue, pomodoro: { ...pomodoroSettings.pomodoro, currentValue: pomodoroSettings.pomodoro.initValue } });
        } else if (pomodoroSettings.currentTab === 1) {

            setpomodoroSettings({ ...pomodoroSettings, currentTab: newValue, shortBreak: { ...pomodoroSettings.shortBreak, currentValue: pomodoroSettings.shortBreak.initValue } })
        } else if (pomodoroSettings.currentTab === 2) {

            setpomodoroSettings({ ...pomodoroSettings, currentTab: newValue, longBreak: { ...pomodoroSettings.longBreak, currentValue: pomodoroSettings.longBreak.initValue } })
        }
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
                if (pomodoroSettings.currentTab === 0) {
                    if (pomodoroSettings.pomodoro.currentValue === 0) {
                        setAppBarTimerWidth(0);
                        if (pomodoroSettings.longBreakInterval.currentValue === 1) {
                            setpomodoroSettings({ ...pomodoroSettings, pomodoro: { initValue: pomodoroSettings.pomodoro.initValue, currentValue: pomodoroSettings.pomodoro.initValue }, currentTab: 2})
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
                        setAppBarTimerWidth(0);
                        setpomodoroSettings({ ...pomodoroSettings, longBreak: { initValue: pomodoroSettings.longBreak.initValue, currentValue: pomodoroSettings.longBreak.initValue }, longBreakInterval: { initValue: pomodoroSettings.longBreakInterval.initValue, currentValue: pomodoroSettings.longBreakInterval.initValue }, currentTab: 0 })
                        context.setTheme(0);
                        handleStartStop();
                    } else {
                        setpomodoroSettings({ ...pomodoroSettings, longBreak: { ...pomodoroSettings.longBreak, currentValue: pomodoroSettings.longBreak.currentValue - 1 } })
                        setAppBarTimerWidth(100 - ((pomodoroSettings.longBreak.currentValue - 1) / pomodoroSettings.longBreak.initValue) * 100);
                    }
                }
            }, 50);

            return () => {
                clearInterval(interval);
            }
        }
    }, [start, pomodoroSettings])

    return (
        <ThemeProvider theme={themes[pomodoroSettings.currentTab]}>
            <Container className={classes.root}>
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
                            <div style={{ height: "3px", width: `${appBarTimerWidth}%`, backgroundColor: "white", borderRadius:"7px" }} />
                        </Grid>
                    </Grid>
                    <Paper className={classes.paper} elevation={0}>
                        <Tabs value={pomodoroSettings.currentTab} className={classes.tabContainer} centered onChange={handleChange} aria-label="Pomodoro tabs" textColor="inherit" TabIndicatorProps={{ style: { display: "none" } }}>
                            <Tab className={classes.tabs} label="Pomodoro " {...tabProps(0)} />
                            <Tab className={classes.tabs} label="Short Break" {...tabProps(1)} />
                            <Tab className={classes.tabs} label="Long Break" {...tabProps(2)} />
                        </Tabs>
                        <TabPanel currentTab={pomodoroSettings.currentTab} index={0} timer={pomodoroSettings.pomodoro.currentValue} />
                        <TabPanel currentTab={pomodoroSettings.currentTab} index={1} timer={pomodoroSettings.shortBreak.currentValue} />
                        <TabPanel currentTab={pomodoroSettings.currentTab} index={2} timer={pomodoroSettings.longBreak.currentValue} />
                        <Button variant="contained" className={classes.startButton} disableElevation onClick={handleStartStop}>{start ? 'Stop' : 'Start'}</Button>
                    </Paper>
                    <Task />
                </Container >
            </Container >
        </ThemeProvider>
    );
}

export default App;
