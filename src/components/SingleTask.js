import React, { useState, useEffect } from 'react';

//MUI
import { Card, CardActions, CardContent, IconButton, Paper, TextField, Button, Grid, TextareaAutosize } from '@mui/material';
import { makeStyles } from '@mui/styles';

//Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Typography } from '@material-ui/core';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';

const useStyles = makeStyles({
    card: {
        width: "100%"
    },
    paperHeaderContainer: {
        borderLeft: "6px solid transparent",
        '&:hover': {
            borderLeft: "6px solid rgb(223,223,223)",
            borderRadius: "4px"
        }
    },
    gridHeaderContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
        cursor: "pointer",
    },
    paperTitle: {
        display: "flex",
        alignItems: "center",
        padding: 0
    },
    paperSettings: {
        display: "flex",
        alignItems: "center",
        justifyContent: "end"
    },
    taskMoreOverButton: {
        border: "1px solid rgb(223, 223, 223)",
        borderRadius: "5px",
        "&:hover": {
            backgroundColor: "rgb(223, 223, 223)"
        }
    },
    addNote: {
        textDecoration: "underline",
        padding: 0,
        fontSize: "0.75rem",
        color: 'rgba(0,0,0,0.4)',
        "&:hover": {
            backgroundColor: "transparent",
            textDecoration: "underline",
            color: 'rgba(0,0,0,0.6)'
        },
    },
    cardActions: {
        backgroundColor: 'rgb(239, 239, 239)',
        color: 'rgba(0,0,0,0.6)',
        padding: "15px",
        display: "flex",
        justifyContent: "end",
        '&:hover': {
            color: 'rgba(0,0,0,0.8)'
        }
    },
    saveButton: {
        backgroundColor: "rgba(0,0,0,0.8)",
        color: "rgba(255,255,255,0.8)",
        '&:hover': {
            backgroundColor: "rgba(0,0,0,1)",
            color: "rgba(255,255,255,1)",
        }
    },
    actionButtons: {
        textTransform: 'capitalize',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
        color: 'rgb(136,136,136)',
        '&:hover': {
            backgroundColor: 'transparent',
            color: 'rgb(120,120,120)',
        }
    },
    textArea: {
        border: "none",
        backgroundColor: "rgb(239,239,239)",
        padding: "10px",
        color: "rgb(85,85,85)",
        boxSizing: 'border-box',
        outline: "unset",
        width: "100%",
        borderRadius: "5px",
        fontSize: "12px",
        '&:focus-visible': {
            border: "none"
        }
    },
    upAndDownIcons: {
        backgroundColor: "#fff",
        margin: "5px",
        minWidth: "unset",
        padding: "5px",
        '&:hover': {
            backgroundColor: "#fff"
        },
        '&:focus': {
            backgroundColor: "#fff"
        }
    },
    numberPomodoros: {
        width: "75px",
        backgroundColor: "rgb(239,239,239)",
        outline: "0px none transparent"
    },
    buttonCircleIcon: {
        '&:hover': {
            backgroundColor: "transparent"
        },
        '& svg': {
            fontSize: "2rem",
            '&:hover': {
                opacity: 0.6
            },
        }
    },
    paperNotes: {
        padding: "10px",
        backgroundColor: "rgb(252,248,222)",
        color: "rgb(95,85,21)",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 0px"
    }
})

function SingleTask(props) {
    const { tasks, taskIndex, setTasks, focusedTask, setFocusedTask, card } = props;
    const classes = useStyles();
    const [clicked, setClicked] = useState(false);
    const [task, setTask] = useState(tasks[taskIndex]);
    const [isCard, setIsCard] = useState(card);

    useEffect(() => { // Updating task to the value of the tasks[taskIndex] if it has been modified. Important to update it in useEffect (and not just initialize it with taks[taskIndex] in useState without useEffect because task will not update to the new value in that case).
        setTask(tasks[taskIndex])
    }, [tasks, taskIndex])

    const completeTask = (e) => {
        e.stopPropagation();
        const tmpTask = { ...task, completed: !task.completed };
        setTask(tmpTask);

        const tmpTasks = [...tasks];
        tmpTasks[taskIndex] = tmpTask;
        setTasks(tmpTasks);

        if (focusedTask === taskIndex && tmpTask.completed === true) {
            let newFocused = tmpTasks.findIndex((oneTask) => oneTask.completed === false );
            if (newFocused !== -1)
                setFocusedTask(newFocused)
            else
                setFocusedTask(-1);
        }
    }

    const taskHeader = (
        <Paper onClick={() => setFocusedTask(taskIndex)} className={classes.paperHeaderContainer} style={focusedTask === taskIndex ? { borderLeft: "6px solid black" } : {} }>
            <Grid container className={classes.gridHeaderContainer} >
                <Grid item container justifyContent="space-between">
                    <Grid item className={classes.paperTitle}>
                        <IconButton size="small" className={classes.buttonCircleIcon} onClick={completeTask}>
                            <CheckCircleIcon style={{ color: task.completed ? "rgb(217,85,80)" : "rgb(223,223,223)" }} />
                        </IconButton>
                        <Typography variant="body1" style={{ textDecoration: task.completed ? "line-through" : "unset" }}>{task.taskName}</Typography>
                    </Grid>
                    <Grid item className={classes.paperSettings}>
                        <Typography variant="h6" style={{ marginRight: "10px", color: "rgb(160,160,160)" }}>{`${task.completedPomodoros} / ${task.taskPomodoros}`}</Typography>
                        <IconButton className={classes.taskMoreOverButton} onClick={(e) => { e.stopPropagation(); setIsCard(true) }} size="small">
                            <MoreVertIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                {task.taskNotes !== "" && (<Grid item xs={11}>
                    <Grid item>
                        <Paper elevation={0} className={classes.paperNotes}>
                            <Typography variant="body1">{task.taskNotes}</Typography>
                        </Paper>
                    </Grid>
                </Grid>)}
            </Grid>
        </Paper >
    )

    const taskSettings = (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField style={{ width: "100%" }} variant="standard" placeholder="What are you working on?" value={task.taskName} onChange={(e) => setTask({ ...task, taskName: e.target.value })} />
                    </Grid>
                    <Grid item container xs={12}>
                        <Grid item xs={12}>
                            <Typography variant="body1" fontWeight="bold">
                                Est Pomodoros
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField type="number" variant="outlined" size="small" className={classes.numberPomodoros} value={task.taskPomodoros} onChange={(e) => setTask({ ...task, taskPomodoros: e.target.value >= 0 ? e.target.value : task.taskPomodoros })} />
                            <Button className={classes.upAndDownIcons} variant="contained" color="inherit" onClick={() => setTask({ ...task, taskPomodoros: task.taskPomodoros + 1 })}>
                                <ArrowDropUpIcon />
                            </Button>
                            <Button className={classes.upAndDownIcons} variant="contained" color="inherit" onClick={() => setTask({ ...task, taskPomodoros: task.taskPomodoros >= 1 ? task.taskPomodoros - 1 : task.taskPomodoros })}>
                                <ArrowDropDown />
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        {clicked ? (<TextareaAutosize className={classes.textArea} minRows={3} placeholder="Some notes..." value={task.taskNotes} onChange={(e) => setTask({ ...task, taskNotes: e.target.value })} />) :
                            (<Button variant="string" className={classes.addNote} onClick={() => setClicked(true)}>+ Add note</Button>)}
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions className={classes.cardActions}>
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <Button className={classes.actionButtons} onClick={() => {
                            let tmptasks = [...tasks];
                            tmptasks.splice(taskIndex, 1);
                            setTasks(tmptasks);
                        }
                        }>Delete</Button>
                    </Grid>
                    <Grid item>
                        <Button className={classes.actionButtons} color="inherit" onClick={() => {
                            setIsCard(false);
                            if (tasks[taskIndex].taskName === "") {
                                let tmptasks = [...tasks];
                                tmptasks.splice(taskIndex, 1);
                                setTasks(tmptasks);
                            } else
                                setTask(tasks[taskIndex]);
                        }
                        }>Cancel</Button>
                        <Button variant="contained" disableElevation disabled={task.taskName === "" || task.taskPomodoros === 0} className={classes.saveButton} onClick={() => {
                            const tmpTasks = [...tasks];
                            tmpTasks[taskIndex] = task;
                            setTasks(tmpTasks);
                            setIsCard(false);
                        }}>Save</Button>
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    )

    return isCard ? taskSettings : taskHeader;
}

export default SingleTask
