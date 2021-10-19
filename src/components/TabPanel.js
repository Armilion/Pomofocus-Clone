//React 
import React from 'react';

//MUI
import { Container, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    timeContainer : {
        marginBottom: "20px"
    }
})

export default function TabPanel(props) {
    const { currentTab, index, timer } = props;
    const classes = useStyles();
    return (
        <div
            role="tabpanel"
            hidden={currentTab !== index}
            id={`tabpanel-${index}`}
            area-labelledby={`tab-${index}`}
        >
            {currentTab === index && (
                <Container className={classes.timeContainer}>
                    <Typography variant="h1">{`${Math.floor(timer / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}</Typography>
                </Container>
            )}

        </div>
    )
}
