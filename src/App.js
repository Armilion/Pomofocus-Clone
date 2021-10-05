import './App.css';

// MUI
import { Button, Tab, Tabs, Typography, Paper, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Local imports 
import Task from "./components/Task";
import Settings from "./components/Settings";
import TabPanel from './components/TabPanel';

//React
import { useState, useEffect } from 'react';

//Icons
import CheckCircleIcon from '@material-ui/icons/CheckCircle';


const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: theme.palette.secondary.main,
        color: "#fff"
    },
    subRoot: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    appBar: {
        display: "flex",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: theme.palette.secondary.main,
        padding: "10px",
        borderBottom: "1px solid rgba(0,0,0,0.2)"
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        margin: "20px",
        backgroundColor: theme.palette.secondary.light,
        color: "white"
    },
    startButton: {
        fontSize: "22px",
        color: theme.palette.secondary.main,
        backgroundColor: "white",
        boxShadow: "0px 5px 0px 0px rgb(235,235,235)"
    }
}))


function App(props) {
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
        if (pomodoroSettings.currentTab === 0)
            setpomodoroSettings({ ...pomodoroSettings, currentTab: newValue, pomodoro: { ...pomodoroSettings.pomodoro, currentValue: pomodoroSettings.pomodoro.initValue } })
        else if (pomodoroSettings.currentTab === 1)
            setpomodoroSettings({ ...pomodoroSettings, currentTab: newValue, shortBreak: { ...pomodoroSettings.shortBreak, currentValue: pomodoroSettings.shortBreak.initValue } })
        else if (pomodoroSettings.currentTab === 2)
            setpomodoroSettings({ ...pomodoroSettings, currentTab: newValue, longBreak: { ...pomodoroSettings.longBreak, currentValue: pomodoroSettings.longBreak.initValue } })
        setstart(false);
    }

    const handleStartStop = () => {
        setstart(!start);
    }

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
        <Container maxWidth="xl" className={classes.root}>
            <Container maxWidth="sm" className={classes.subRoot}>
                <Container className={classes.appBar}>
                    <div style={{ display: "flex" }}>
                        <CheckCircleIcon />
                        <Typography variant="h6">Pomofocus</Typography>
                    </div>
                    <Settings pomodoroSettings={pomodoroSettings} setpomodoroSettings={setpomodoroSettings} />
                </Container>
                <Paper className={classes.paper} elevation={0}>
                    <Tabs value={pomodoroSettings.currentTab} centered onChange={handleChange} aria-label="Pomodoro tabs" TabIndicatorProps={{ style: { display: "none" } }}>
                        <Tab label="Pomodoro" id='tab-0' aria-controls='tabpanel-0' />
                        <Tab label="Short Break" id='tab-1' aria-controls='tabpanel-1' />
                        <Tab label="Long Break" id='tab-2' aria-controls='tabpanel-2' />
                    </Tabs>
                    <TabPanel currentTab={pomodoroSettings.currentTab} index={0} timer={pomodoroSettings.pomodoro.currentValue} />
                    <TabPanel currentTab={pomodoroSettings.currentTab} index={1} timer={pomodoroSettings.shortBreak.currentValue} />
                    <TabPanel currentTab={pomodoroSettings.currentTab} index={2} timer={pomodoroSettings.longBreak.currentValue} />
                    <Button variant="contained" className={classes.startButton} disableElevation onClick={handleStartStop}>{start ? 'Stop' : 'Start'}</Button>
                </Paper>
                <Task />
            </Container >
        </Container >
    );
}

export default App;
