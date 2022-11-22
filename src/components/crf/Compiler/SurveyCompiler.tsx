import React from 'react';
import { QuestionForm } from './QuestionCompiler';
import { BaseSidebarLayout } from './SidebarCompiler';
import { Box, CssBaseline, Paper, Typography } from '@mui/material';
import { useState, useEffect } from "react";
import { HorizontalStepper } from './StepperCompiler';
import { NavigationButtons } from './NavigationButtonsCompiler';
import { PageForm } from './PageCompiler';
import { SurveyNav, useNavState } from '../Navigation';
import { Survey, SurveyMap } from '../../../core/schema';
import { useFormState } from '../../forms';

export interface SurveyFormProps {
    survey: Survey;
}

export function SurveyForm({
    survey,
}: SurveyFormProps) {

    const drawerWidth = 320;

    const [showAllErrors, setShowAllErrors] = React.useState(false);
    const { Value, setValue, validators, requires, Valid } = useFormState(
        survey.toUseFormState()
    );
    const onSubmit = (answers, allValid) => console.log(answers);
    const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setShowAllErrors(true);
        onSubmit(Value as any, Valid);
    };
    const surveyNav = useNavState(survey.root);

    return (
        <Box sx={{ display: 'flex', width:'100%' }}>
            <CssBaseline />
            <BaseSidebarLayout
                drawerWidth={drawerWidth}
                root={survey.root}
                surveyNav={surveyNav}
            />
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <HorizontalStepper
                    root={survey.root}
                    surveyNav={surveyNav}
                    valid={Valid}
                />
                <form onSubmit={onSubmitForm}>
                    <Paper style={{margin:'24px',padding:'24px'}}>
                        <Typography variant="h3">{survey.root.text}</Typography>
                        {survey.root.layout.style === SurveyMap.layout.style.multi_folder ? (
                            <div>
                                {survey.root.items.map((itm) => {
                                    return itm.id === surveyNav.getFolderId() ?
                                        <div key={itm.id}>
                                            <Typography variant="h4">{itm.text}</Typography>
                                            {itm.items.map((itm2) => {
                                                return itm2.id === surveyNav.getPageId() ?
                                                    <div key={itm2.id}>
                                                            <PageForm 
                                                                item={itm2}
                                                                value={Value[itm.id][itm2.id]}
                                                                setValue={setValue[itm.id][itm2.id] as any}
                                                                validators={validators[itm.id][itm2.id]}
                                                                requires={requires[itm.id][itm2.id]}
                                                                showError={showAllErrors}
                                                                // onSubmit={(answers, allValid) => console.log(answers)}
                                                            />
                                                    </div>
                                                    : null
                                            })}
                                        </div> 
                                        : null
                                    })}
                            </div>
                        ) : null}
                    </Paper>
                </form>
                <NavigationButtons
                    root={survey.root}
                    surveyNav={surveyNav}
                    valid={Valid}
                />
                <div>
                    <p>Value</p>
                    <pre>{JSON.stringify(Value[surveyNav.getFolderId()][surveyNav.getPageId()], null, 2)}</pre>
                    {/* <p>setValue</p>
                    <pre>{JSON.stringify(setValue, null, 2)}</pre> */}
                    <p>validators</p>
                    <pre>{JSON.stringify(validators[surveyNav.getFolderId()][surveyNav.getPageId()], null, 2)}</pre>
                    <p>requires</p>
                    <pre>{JSON.stringify(requires[surveyNav.getFolderId()][surveyNav.getPageId()], null, 2)}</pre>
                    <p>Valid</p>
                    <pre>{JSON.stringify(typeof Valid !== 'boolean' ? Valid.children[surveyNav.getFolderId()].children[surveyNav.getPageId()] : {}, null, 2)}</pre>
                </div>

            </Box>

        </Box>
    );
}