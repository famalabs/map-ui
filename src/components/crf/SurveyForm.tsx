import React from 'react';
// import { SurveyItemForm } from './SurveyItem'
import {Survey} from '../../core/schema'
// import {Survey, SurveyItem} from '../../core/schema'
import { QuestionForm } from './Question';
import { Form, useFormState } from '../forms';
import { BaseSidebarLayout } from './BaseSidebarLayout';
import { Box, CssBaseline, Paper, Typography } from '@mui/material';
import { useState, useEffect } from "react";
import { HorizontalStepper } from './HorizontalStepper';
import { NavigationButtons } from './NavigationButtons';
import { PageForm } from './Page';

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

    var startFolder: [string, number] = ["",0];
    var startPage: [string, number] = ["",0];
    if (survey.root.layout.style === 'multi_folder') {
        startFolder = [survey.root.items[0].id,0];
        startPage = [survey.root.items[0].items[0].id,0];
    }
    const [folder, setFolder] = useState(startFolder);
    function handleSetFolder(folder: [string, number], page?: [string, number]) {
        setFolder(folder);
        if (typeof page !== 'undefined') {
            setPage(page);
            if (folder[0] in visited) {
                if (visited[folder[0]][1] < page[1]) {
                    visited[folder[0]] = page;
                    setVisited(visited)
                }
            } else {
                visited[folder[0]] = page;
                setVisited(visited);
            }
        } else {
            setPage([survey.root.items[folder[1]].items[0].id,0])
        }
    };
    const [page, setPage] = useState(startPage);
    function handleSetPage(page: [string, number]) {
        setPage(page);
    };
    const [visited, setVisited] = useState({startFolder:startPage});

    // return null;
    return (
        <Box sx={{ display: 'flex', width:'100%' }}>
            <CssBaseline />
            <BaseSidebarLayout
                drawerWidth={drawerWidth}
                root={survey.root}
                folder={folder}
                handleSetFolder={handleSetFolder}
                page={page}
                handleSetPage={handleSetPage}
            />
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <HorizontalStepper
                    root={survey.root}
                    folder={folder}
                    handleSetFolder={handleSetFolder}
                    page={page}
                    handleSetPage={handleSetPage}
                    valid={Valid}
                    visited={visited}
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
                                    return itm.id === folder[0] ?
                                        <div key={itm.id}>
                                            <Typography variant="h4">{itm.text}</Typography>
                                            {itm.items.map((itm2) => {
                                                return itm2.id === page[0] ?
                                                    <div key={itm2.id}>
                                                        <Typography variant="h5">{itm.id}/{itm2.id}</Typography>
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
                    folder={folder}
                    handleSetFolder={handleSetFolder}
                    page={page}
                    handleSetPage={handleSetPage}
                    valid={Valid}
                    visited={visited}
                />
                <div>
                    <p>Value</p>
                    <pre>{JSON.stringify(Value[folder[0]][page[0]], null, 2)}</pre>
                    {/* <p>setValue</p>
                    <pre>{JSON.stringify(setValue, null, 2)}</pre> */}
                    <p>validators</p>
                    <pre>{JSON.stringify(validators[folder[0]][page[0]], null, 2)}</pre>
                    <p>requires</p>
                    <pre>{JSON.stringify(requires[folder[0]][page[0]], null, 2)}</pre>
                    <p>Valid</p>
                    <pre>{JSON.stringify(Valid.children[folder[0]].children[page[0]], null, 2)}</pre>
                </div>

            </Box>

        </Box>
    );
}