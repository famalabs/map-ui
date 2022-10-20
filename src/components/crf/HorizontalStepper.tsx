import { Box, Button, Step, StepButton, StepLabel, Stepper, Typography } from '@mui/material';
import { SurveyItem } from '@src/core/schema';
import React from 'react';
import { INavState, SurveyNav } from './Navigation';

export interface HorizontalStepperProps {
    root: SurveyItem;
    surveyNav: INavState;
    // folder:[string, number];
    // handleSetFolder:any;
    // page:[string, number];
    // handleSetPage:any;
    valid:any;
    // visited: any;
}

export function HorizontalStepper({
    root,
    surveyNav,
    // folder,
    // handleSetFolder,
    // page,
    // handleSetPage,
    valid,
    // visited
}: HorizontalStepperProps) {
    // const pages = root.items[folder[1]].items;
    const isStepFailed = (pg: SurveyItem, idx: number) => {
        return valid.children[surveyNav.getFolderId()].children[pg.id].allValid ? false : (idx < surveyNav.getPageIdx());
    };
    return (
        <Box sx={{ width: '100%' }}>
        <Stepper alternativeLabel nonLinear 
            // activeStep={page[1]}
            activeStep={surveyNav.getPageIdx()}
        >
            {surveyNav.getPages().map((pg, idx) => {
            const labelProps: {
                optional?: React.ReactNode;
                error?: boolean;
                } = {};
            if (isStepFailed(pg, idx)) {
                labelProps.optional = (<Typography variant="caption" color="error"></Typography>);
                labelProps.error = true;
            }
            return (<Step key={pg.id} completed={valid.children[surveyNav.getFolderId()].children[pg.id].allValid}>
            {/* <StepButton color="inherit" onClick={(e) => {handleSetPage([itm.id,idx]);}}> */}
                <StepButton color="inherit" onClick={(e) => {surveyNav.setPage(pg)}}>
                    <StepLabel {...labelProps}>{pg.text}</StepLabel>
                </StepButton>
            </Step>)
            })}
        </Stepper>
        </Box>
    );
}
