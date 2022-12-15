import { Box, Button, Step, StepButton, StepLabel, Stepper, Typography } from '@mui/material';
import { SurveyItem } from '../../../core/schema';
import React from 'react';
import { INavState, SurveyNav } from '../Navigation';
import { IUseFormCompiler } from './FormCompiler';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';

export interface HorizontalStepperProps {
    formCompiler:IUseFormCompiler;
}

export function HorizontalStepper({
    formCompiler,
}: HorizontalStepperProps) {
    // const pages = root.items[folder[1]].items;
    const form = formCompiler.form;
    const nav = formCompiler.nav;
    
    const renderIcon = (pg:SurveyItem) => {
        return pg.id===nav.getPageId() ? 
        (<EditIcon/>) : form.getValid(pg.id) ?
            (<CheckCircleIcon color="success"/>) : (<CancelIcon color="error"/>);
    }

    if (nav.getPages().length <= 1) {
        return null;
    }

    return (
        <Box sx={{ width: '100%' }}>
        <Stepper alternativeLabel nonLinear 
            // activeStep={page[1]}
            activeStep={nav.getPageIdx()}
        >
            {nav.getPages().map((pg, idx) => {
            // const labelProps: {
            //     optional?: React.ReactNode;
            //     error?: boolean;
            //     } = {};
            // if (isStepFailed(pg, idx)) {
            //     labelProps.optional = (<Typography variant="caption" color="error"></Typography>);
            //     labelProps.error = true;
            // }
            return (<Step key={pg.id} completed={form.getValid(pg.id)}>
                <StepButton color="inherit" onClick={(e) => {nav.setPage(pg)}}
                icon={renderIcon(pg)}>
                    {/* <StepLabel {...labelProps}>{pg.text}</StepLabel> */}
                    <StepLabel >{pg.text}</StepLabel>
                </StepButton>
            </Step>)
            })}
        </Stepper>
        </Box>
    );
}
