import { Box, Button, Step, StepButton, StepLabel, Stepper, Typography } from '@mui/material';
import { SurveyItem } from '../../../core/schema';
import React from 'react';
import { INavState, SurveyNav } from '../Navigation';
import { IUseFormCompiler } from './FormCompiler';

export interface HorizontalStepperProps {
    formCompiler:IUseFormCompiler;
}

export function HorizontalStepper({
    formCompiler,
}: HorizontalStepperProps) {
    // const pages = root.items[folder[1]].items;
    const form = formCompiler.form;
    const nav = formCompiler.nav;

    const isStepFailed = (pg: SurveyItem, idx: number) => {
        return form.getValid(pg.id) ? false : (idx < nav.getPageIdx());
    };
    return (
        <Box sx={{ width: '100%' }}>
        <Stepper alternativeLabel nonLinear 
            // activeStep={page[1]}
            activeStep={nav.getPageIdx()}
        >
            {nav.getPages().map((pg, idx) => {
            const labelProps: {
                optional?: React.ReactNode;
                error?: boolean;
                } = {};
            if (isStepFailed(pg, idx)) {
                labelProps.optional = (<Typography variant="caption" color="error"></Typography>);
                labelProps.error = true;
            }
            return (<Step key={pg.id} completed={form.getValid(pg.id)}>
                <StepButton color="inherit" onClick={(e) => {nav.setPage(pg)}}>
                    <StepLabel {...labelProps}>{pg.text}</StepLabel>
                </StepButton>
            </Step>)
            })}
        </Stepper>
        </Box>
    );
}
