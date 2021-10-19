import React, { useState } from 'react'
import { Typography, Grid, Divider, IconButton, Menu, MenuItem, Container, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

//Icons 
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

//Local Imports
import SingleTask from './SingleTask';

const useStyles = makeStyles((theme) => ({
    moreOverButton: {
        color: "#efefef",
        backgroundColor: "rgba(255,255,255,0.3)",
        borderRadius: "5px",
        "&:hover": {
            backgroundColor: "rgba(255,255,255,0.3)",
            color: "white"
        }
    },
    divider: {
        backgroundColor: "rgba(255,255,255,0.7)",
        marginTop: "8px"
    },
    addTaskContainer: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: "8px",
        border: "2px dashed rgba(255,255,255,0.5)",
        display: "flex",
        justifyContent: "center",
        width: "100%",
        height: "60px",
        color: "rgba(255,255,255,0.5)",
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
            border: "2px dashed rgba(255,255,255,0.7)",
            color: "rgba(255,255,255,0.7)"
        }
    }
}))


function Task() {
    const [anchorEl, setAnchorEl] = useState(null)
    const classes = useStyles();
    const [tasks, setTasks] = useState([])

    const handleOpenMenu = (e) => {
        setAnchorEl(e.currentTarget)
    }

    const handleCloseMenu = () => {
        setAnchorEl(null);
    }

    const addTask = () => {
        setTasks([...tasks, { taskName: "", taskPomodoros: 0, taskNotes: "" }])
    }

    const deleteAllTasks = () => {
        setTasks([]);
        handleCloseMenu();
    }

    return (
        <Grid container justifyContent="center" spacing={2}>
            <Grid container item xs={12}>
                <Grid item xs={11}>
                    <Typography variant="h6">Tasks</Typography>
                </Grid>
                <Grid item xs={1}>
                    <IconButton aria-controls="task-menu" size="small" className={classes.moreOverButton} aria-label="more over" onClick={handleOpenMenu}>
                        <MoreVertIcon />
                    </IconButton>
                    <Menu id="task-menu" open={Boolean(anchorEl)} anchorEl={anchorEl} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }} getContentAnchorEl={null} onClose={handleCloseMenu}> {/* getContentAnchorEl has to be set to null to change the vertical position of anchorOrigin */}
                        <MenuItem onClick={deleteAllTasks}>
                            <DeleteIcon />
                            <Typography variant="body1">Clear all tasks</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleCloseMenu}>
                            <DeleteIcon />
                            <Typography variant="body1">Clear finished tasks</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleCloseMenu}>
                            <CheckIcon />
                            <Typography variant="body1">Clear act Pomodoros</Typography>
                        </MenuItem>
                    </Menu>
                </Grid>
                <Grid item xs={12}>
                    <Divider className={classes.divider} />
                </Grid>
            </Grid>
            <Grid item xs={12} className={classes.addTask}>
                <Button variant="outlined" disableElevation className={classes.addTaskContainer} size="small" startIcon={<AddCircleIcon />} onClick={addTask}>
                    Add Task
                </Button>
            </Grid>
            {
                tasks.map((task,index) => (
                    <Grid key={index} item xs={12}>
                        <SingleTask tasks={tasks} taskIndex={index} setTasks={setTasks} card={true}/>
                    </Grid>
                ))
            }
        </Grid>
    )
}

export default Task
