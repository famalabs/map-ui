import { Box, Button, Step, StepButton, Stepper, Typography } from '@mui/material';
import { SurveyItem } from '@src/core/schema';
import { debug } from 'console';
import * as React from 'react';

export interface HorizontalStepperProps {
    root: SurveyItem;
    folder:string;
    handleSetFolder:any;
    page:string;
    handleSetPage:any;
}

export function HorizontalStepper({
    root,
    folder,
    handleSetFolder,
    page,
    handleSetPage
}: HorizontalStepperProps) {
    const pages = root.items
        .find(itm => {return itm.id === folder; }).items;
    
    return (
        <Box sx={{ width: '100%' }}>
        <Stepper alternativeLabel nonLinear activeStep={pages.findIndex((item) => item.id === page)}>
            {pages.map((itm, index) => (
            <Step key={itm.id} completed={false}>
                <StepButton color="inherit" onClick={(e) => {handleSetPage(itm.id)}}>
                {itm.text}
                </StepButton>
            </Step>
            ))}
        </Stepper>
        </Box>
    );
}
