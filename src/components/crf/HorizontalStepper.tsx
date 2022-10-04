import { Box, Button, Step, StepButton, StepLabel, Stepper, Typography } from '@mui/material';
import { SurveyItem } from '@src/core/schema';
import React from 'react';

export interface HorizontalStepperProps {
    root: SurveyItem;
    folder:[string, number];
    handleSetFolder:any;
    page:[string, number];
    handleSetPage:any;
    valid:any;
    visited: any;
}

export function HorizontalStepper({
    root,
    folder,
    handleSetFolder,
    page,
    handleSetPage,
    valid,
    visited
}: HorizontalStepperProps) {
// const pages = root.items
//     .find(itm => {return itm.id === folder[0]; }).items;
    const pages = root.items[folder[1]].items;
    const isStepFailed = (pg: SurveyItem, idx: number) => {
        // const curPage = pages.findIndex((item) => item.id === page);
        // const thisPage = pages.findIndex((item) => item.id === pg.id);
        return valid.children[folder[0]].children[pg.id].allValid ? false : (idx < page[1]);
    };
    return (
        <Box sx={{ width: '100%' }}>
        <Stepper alternativeLabel nonLinear 
            // activeStep={pages.findIndex((item) => item.id === page)}
            activeStep={page[1]}
        >
            {pages.map((itm, idx) => {
            const labelProps: {
                optional?: React.ReactNode;
                error?: boolean;
                } = {};
            if (isStepFailed(itm, idx)) {
                labelProps.optional = (<Typography variant="caption" color="error"></Typography>);
                labelProps.error = true;
            }
            return (<Step key={itm.id} completed={valid.children[folder[0]].children[itm.id].allValid}>
                <StepButton color="inherit" onClick={(e) => {handleSetPage([itm.id,idx]);}}>
                    <StepLabel {...labelProps}>{itm.text}</StepLabel>
                </StepButton>
            </Step>)
            })}
        </Stepper>
        </Box>
    );
}
