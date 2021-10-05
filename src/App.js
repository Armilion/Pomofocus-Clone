import './App.css';

// MUI
import { Button, Tab, Tabs, Typography, Paper, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Local imports 
import Task from "./components/Task";
import Settings from "./components/Settings";
import TabPanel from './components/TabPanel';

//React
import { useState } from 'react';

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
    const [value, setValue] = useState(0);
    const classes = useStyles();
    const [pomodoroOptions, setPomodoroOptions] = useState({
        pomodoro: 1500,
        shortBreak: 300,
        longBreak: 600,
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
        setValue(newValue)
    }

    return (
        <Container maxWidth="xl" className={classes.root}>
            <Container maxWidth="sm" className={classes.subRoot}>
                <Container className={classes.appBar}>
                    <div style={{ display: "flex" }}>
                        <CheckCircleIcon />
                        <Typography variant="h6">Pomofocus</Typography>
                    </div>
                    <Settings pomodoroOptions={pomodoroOptions} setPomodoroOptions={setPomodoroOptions} />
                </Container>
                <Paper className={classes.paper} elevation={0}>
                    <Tabs value={value} centered onChange={handleChange} aria-label="Pomodoro tabs" TabIndicatorProps={{ style: { display: "none" } }}>
                        <Tab label="Pomodoro" id='tab-0' aria-controls='tabpanel-0' />
                        <Tab label="Short Break" id='tab-1' aria-controls='tabpanel-1' />
                        <Tab label="Long Break" id='tab-2' aria-controls='tabpanel-2' />
                    </Tabs>
                    <TabPanel value={value} index={0} timer={pomodoroOptions.pomodoro}>test</TabPanel>
                    <TabPanel value={value} index={1} timer={pomodoroOptions.shortBreak}>toast</TabPanel>
                    <TabPanel value={value} index={2} timer={pomodoroOptions.longBreak}>toasiteizt</TabPanel>
                    <Button variant="contained" className={classes.startButton} disableElevation>Start</Button>
                </Paper>
                <Task />
            </Container >
        </Container >
    );
}

export default App;
