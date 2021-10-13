import './App.css';

// MUI
import { Button, Tab, Tabs, Typography, Paper, Container } from '@mui/material';

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
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        justifyContent: "center",
        backgroundColor: theme.palette.primary.main,
        transition: theme.transitions.create(['background-color', 'transform'], { duration: 1000 }),
        height: "100vh",
        color: "#fff"
    },
    subRoot: {
        maxWidth: "600px"
    },
    appBar: {
        display: "flex !important",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: "10px",
        borderBottom: "1px solid rgba(0,0,0,0.2)"
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
        minHeight: "unset"
    },
    tabContainer: {
        width: "100%",
        '& .css-1wf8b0h-MuiTabs-flexContainer': {
            justifyContent: "space-evenly"
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
        pomodoro: { initValue: 1500, currentValue: 1500 },
        shortBreak: { initValue: 300, currentValue: 300 },
        longBreak: { initValue: 600, currentValue: 600 },
        longBreakInterval: 4,
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

    const handleChange = (e, newValue) => {
        if (pomodoroSettings.currentTab === 0) {
            setpomodoroSettings({ ...pomodoroSettings, currentTab: newValue, pomodoro: { ...pomodoroSettings.pomodoro, currentValue: pomodoroSettings.pomodoro.initValue } })
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
                if (pomodoroSettings.currentTab === 0)
                    setpomodoroSettings({ ...pomodoroSettings, pomodoro: { ...pomodoroSettings.pomodoro, currentValue: pomodoroSettings.pomodoro.currentValue - 1 } })
                else if (pomodoroSettings.currentTab === 1)
                    setpomodoroSettings({ ...pomodoroSettings, shortBreak: { ...pomodoroSettings.shortBreak, currentValue: pomodoroSettings.shortBreak.currentValue - 1 } })
                else if (pomodoroSettings.currentTab === 2)
                    setpomodoroSettings({ ...pomodoroSettings, longBreak: { ...pomodoroSettings.longBreak, currentValue: pomodoroSettings.longBreak.currentValue - 1 } })
            }, 1000);

            return () => {
                clearInterval(interval);
            }
        }
    }, [start, pomodoroSettings])

    return (
        <ThemeProvider theme={themes[pomodoroSettings.currentTab]}>
            <Container className={classes.root}>
                <Container className={classes.subRoot}>
                    <Container className={classes.appBar}>
                        <div style={{ display: "flex" }}>
                            <CheckCircleIcon />
                            <Typography variant="h6">Pomofocus</Typography>
                        </div>
                        <Settings pomodoroSettings={pomodoroSettings} setpomodoroSettings={setpomodoroSettings} />
                    </Container>
                    <Paper className={classes.paper} elevation={0}>
                        <Tabs value={pomodoroSettings.currentTab} className={classes.tabContainer} centered onChange={handleChange} aria-label="Pomodoro tabs" textColor="white" TabIndicatorProps={{ style: { display: "none" } }}>
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
