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

export interface SurveyFormProps {
    survey: Survey;
}

export function SurveyForm({
    survey,
}: SurveyFormProps) {

    const drawerWidth = 240;

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
    const [page, setPage] = useState(startPage);

    // return null;
    return (
        <Box sx={{ display: 'flex', width:'100%' }}>
            <CssBaseline />
            <BaseSidebarLayout
                drawerWidth={drawerWidth}
                root={survey.root}
                setFolder={setFolder}
                setPage={setPage}
            />
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
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
                    <div>
                        <pre>{JSON.stringify(Value, null, 2)}</pre>
                        <pre>{JSON.stringify(setValue, null, 2)}</pre>
                        <pre>{JSON.stringify(validators, null, 2)}</pre>
                        <pre>{JSON.stringify(requires, null, 2)}</pre>
                        <pre>{JSON.stringify(Valid, null, 2)}</pre>
                    </div>
                </form>
            </Box>

        </Box>
    );
}