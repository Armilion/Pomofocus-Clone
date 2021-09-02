import './App.css';

// MUI
import { Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';

//SwipeableViews
import SwipeableViews from 'react-swipeable-views';

// Local imports 
import Task from "./components/Task";
import Timer from "./components/Timer";
import Completion from "./components/Completion";
import TabPanel from './components/TabPanel';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow:1,
    backgroundColor: theme.palette.background.paper
  },
  tabs : {
    flex:1,
    justifyContent:"space-between"
  },
  tab: {
  }
}))

function App() {
  const [value, setValue] = useState("0");
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs className={classes.tabs} centered onChange={(e, newValue) => setValue(newValue)} aria-label="Pomodoro">
          <Tab className={classes.tab} label="Task" id='simple-tab-0' aria-controls='tabpanel-0'/>
          <Tab className={classes.tab} label="Timer" id='simple-tab-1' aria-controls='tabpanel-1' />
          <Tab className={classes.tab} label="Completion" id='simple-tab-2' aria-controls='tabpanel-2' />
        </Tabs>
      </AppBar>
      <SwipeableViews index={value}>
        <TabPanel value={value} index={0}>
          <Task />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Timer />
        </TabPanel >
        <TabPanel value={value} index={2}>
          <Completion />
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}

export default App;
