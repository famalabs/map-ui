import { Box, Button, Step, StepButton, Stepper, Typography } from '@mui/material';
import { SurveyItem } from '@src/core/schema';
import { debug } from 'console';
import * as React from 'react';

export interface NavigationButtonsProps {
    root: SurveyItem;
    folder:[string, number];
    handleSetFolder:any;
    page:[string, number];
    handleSetPage:any;
    valid:any;
    visited: any;
}

export function NavigationButtons({
    root,
    folder,
    handleSetFolder,
    page,
    handleSetPage,
    valid,
    visited
}: NavigationButtonsProps) {
    // const pages = root.items
    //     .find(itm => {return itm.id === folder; }).items;
    const pages = root.items[folder[1]].items;
    // const activePage = pages.findIndex((item) => item.id === page);
    const activePage = page[1];
    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button color="inherit" disabled={activePage === 0} onClick={(e) => {handleSetPage([pages[activePage-1].id,activePage-1])}} sx={{ mr: 1 }}>
                    Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                    <Button color="inherit" disabled={activePage === pages.length-1} onClick={(e)=>{handleSetPage([pages[activePage+1].id,activePage+1])}} sx={{ mr: 1 }}>
                        Next
                    </Button>
                    {valid.children[folder[0]].allValid && activePage === pages.length-1 ? 
                        folder[1] === root.items.length-1 ? (
                            <Button color="inherit" disabled={false} onClick={(e)=>{}} sx={{ mr: 1 }}>
                                Send Survey
                            </Button>
                        ) : (
                        <Button color="inherit" disabled={false} onClick={(e)=>{handleSetFolder([root.items[folder[1]+1].id,folder[1]+1])}} sx={{ mr: 1 }}>
                            Continue
                        </Button>
                    ) : null}
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
