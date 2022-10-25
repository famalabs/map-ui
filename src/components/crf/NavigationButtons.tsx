import { Box, Button, Step, StepButton, Stepper, Typography } from '@mui/material';
import { SurveyItem } from '@src/core/schema';
import { debug } from 'console';
import * as React from 'react';
import { SurveyNav, INavState } from './Navigation'

export interface NavigationButtonsProps {
    root: SurveyItem;
    surveyNav: INavState;
    // folder:[string, number];
    // handleSetFolder:any;
    // page:[string, number];
    // handleSetPage:any;
    valid:any;
    // visited: any;
}

export function NavigationButtons({
    root,
    surveyNav,
    // folder,
    // handleSetFolder,
    // page,
    // handleSetPage,
    valid,
    // visited
}: NavigationButtonsProps) {
    // const pages = root.items[folder[1]].items;
    // const activePage = page[1];
    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                {/* <Button color="inherit" disabled={activePage === 0} onClick={(e) => {handleSetPage([pages[activePage-1].id,activePage-1])}} sx={{ mr: 1 }}> */}
                <Button color="inherit" disabled={surveyNav.getPageIdx() === 0} onClick={(e) => {surveyNav.prevPage()}} sx={{ mr: 1 }}>
                    Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                    {/* <Button color="inherit" disabled={activePage === pages.length-1} onClick={(e)=>{handleSetPage([pages[activePage+1].id,activePage+1])}} sx={{ mr: 1 }}> */}
                    <Button color="inherit" disabled={surveyNav.getPageIdx() === surveyNav.getPages().length-1} onClick={(e)=>{surveyNav.nextPage()}} sx={{ mr: 1 }}>
                        Next
                    </Button>
                    {/* {valid.children[folder[0]].allValid && activePage === pages.length-1 ? 
                        folder[1] === root.items.length-1 ? (
                            <Button color="inherit" disabled={false} onClick={(e)=>{}} sx={{ mr: 1 }}>
                                Send Survey
                            </Button>
                        ) : (
                        <Button color="inherit" disabled={false} onClick={(e)=>{handleSetFolder([root.items[folder[1]+1].id,folder[1]+1])}} sx={{ mr: 1 }}>
                            Continue
                        </Button>
                    ) : null} */}
                    {valid.children[surveyNav.getFolderId()].allValid && surveyNav.getPageIdx() === surveyNav.getPages().length-1 ? 
                        surveyNav.getFolderIdx() === surveyNav.getFolders().length-1 ? (
                            <Button color="inherit" disabled={false} onClick={(e)=>{}} sx={{ mr: 1 }}>
                                Send Survey
                            </Button>
                        ) : (
                        <Button color="inherit" disabled={false} onClick={(e)=>{surveyNav.nextFolder()}} sx={{ mr: 1 }}>
                            Continue
                        </Button>
                    ) : null}
            </Box>
        </Box>
    );
}
