import React from 'react';
import { SurveyItemForm } from './SurveyItem'
import {Survey} from '../../core/schema'
// import {Survey, SurveyItem} from '../../core/schema'
import { QuestionForm } from './Question';
import { Form, useFormState } from '../forms';
import { debug } from 'console';
import { BaseSidebarLayout } from './BaseSidebarLayout';
import { Box, CssBaseline, Paper, Typography } from '@mui/material';
import { useState, useEffect } from "react";
import { HorizontalStepper } from './HorizontalStepper';
import { NavigationButtons } from './NavigationButtons';

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
        // console.log(Value);
        onSubmit(Value as any, Valid);
    };

    var startFolder = "";
    var startPage = "";
    if (survey.root.layout.style === 'multi_folder') {
        startFolder = survey.root.items[0].id;
        startPage = survey.root.items[0].items[0].id;
    }
    const [folder, setFolder] = useState(startFolder);
    // const handleSetFolder = (id: string) => () => {
    //     setFolder(id);
    // };
    const [page, setPage] = useState(startPage);
    // const handleSetPage = (id: string) => () => {
    //     setPage(id);
    // };

    // return null;
    return (
        <Box sx={{ display: 'flex', width:'100%' }}>
            <CssBaseline />
            <BaseSidebarLayout
                drawerWidth={drawerWidth}
                root={survey.root}
                folder={folder}
                handleSetFolder={setFolder}
                page={page}
                handleSetPage={setPage}
            />
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <HorizontalStepper
                    root={survey.root}
                    folder={folder}
                    handleSetFolder={setFolder}
                    page={page}
                    handleSetPage={setPage}
                />
                <form onSubmit={onSubmitForm}>
                    {/* <SurveyItemForm 
                        item={survey.root}
                        value={Value}
                        setValue={setValue as any}
                        validators={validators}
                        requires={requires}
                        showError={showAllErrors}
                        // onSubmit={(answers, allValid) => console.log(answers)}
                    /> */}
                    <Paper style={{margin:'24px',padding:'24px'}}>
                        <Typography variant="h3">{survey.root.text}</Typography>
                        {survey.root.layout.style === 'multi_folder' ? (
                            <div>
                                {survey.root.items.map((itm) => {
                                    return itm.id === folder ?
                                        <div key={itm.id}>
                                            <Typography variant="h4">{itm.text}</Typography>
                                            {itm.items.map((itm2) => {
                                                return itm2.id === page ?
                                                    <div key={itm2.id}>
                                                        {/* <Typography variant="h5">{itm2.text}</Typography> */}
                                                            <SurveyItemForm 
                                                                item={itm2}
                                                                value={Value}
                                                                setValue={setValue as any}
                                                                validators={validators}
                                                                requires={requires}
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
                    folder={folder}
                    handleSetFolder={setFolder}
                    page={page}
                    handleSetPage={setPage}
                />
                <div>
                    <p>Value</p>
                    <pre>{JSON.stringify(Value[folder][page], null, 2)}</pre>
                    <p>setValue</p>
                    <pre>{JSON.stringify(setValue[folder], null, 2)}</pre>
                    <p>validators</p>
                    <pre>{JSON.stringify(validators[folder][page], null, 2)}</pre>
                    <p>requires</p>
                    <pre>{JSON.stringify(requires[folder][page], null, 2)}</pre>
                    <p>Valid</p>
                    <pre>{JSON.stringify(Valid, null, 2)}</pre>
                </div>

            </Box>

        </Box>
    );
}