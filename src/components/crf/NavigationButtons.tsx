import { Box, Button, Step, StepButton, Stepper, Typography } from '@mui/material';
import { SurveyItem } from '@src/core/schema';
import { debug } from 'console';
import * as React from 'react';

export interface NavigationButtonsProps {
    root: SurveyItem;
    folder:string;
    handleSetFolder:any;
    page:string;
    handleSetPage:any;
}

export function NavigationButtons({
    root,
    folder,
    handleSetFolder,
    page,
    handleSetPage
}: NavigationButtonsProps) {
    const pages = root.items
        .find(itm => {return itm.id === folder; }).items;
    const activePage = pages.findIndex((item) => item.id === page);
    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button color="inherit" disabled={activePage === 0} onClick={(e) => {handleSetPage(pages[activePage-1].id)}} sx={{ mr: 1 }}>
                    Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                    <Button color="inherit" disabled={activePage === pages.length-1} onClick={(e)=>{handleSetPage(pages[activePage+1].id)}} sx={{ mr: 1 }}>
                        Next
                    </Button>
                    {/* {activeStep !== steps.length &&
                    (completed[activeStep] ? (
                    <Typography variant="caption" sx={{ display: 'inline-block' }}>
                        Step {activeStep + 1} already completed
                    </Typography>
                    ) : (
                    <Button onClick={handleComplete}>
                        {completedSteps() === totalSteps() - 1
                        ? 'Finish'
                        : 'Complete Step'}
                    </Button>
                    ))} */}
            </Box>
        </Box>
    );
}
