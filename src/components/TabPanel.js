import { Container, Typography } from '@material-ui/core'
import React from 'react'

export default function TabPanel(props) {
    const { children, value, index, timer } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            area-labelledby={`tab-${index}`}
        >
            {value === index && (
                <Container>
                    <Typography variant="h1">{`${Math.floor(timer / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}</Typography>
                </Container>
            )}

        </div>
    )
}
