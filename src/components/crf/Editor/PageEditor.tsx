import React from 'react';
import {Survey, GroupMap, Question} from '../../../core/schema'
import { AutoSelect } from '../../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid, Typography, InputLabel, Select, MenuItem, FormLabel, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { QuestionEditorForm } from './QuestionEditor';
import { INavState } from '../Navigation';
import { IEditorState } from './EditorBuilder';

export interface PageEditorFormProps {
    editor: IEditorState;
    nav: INavState;
}

export function PageEditorForm({
    editor,
    nav
    }: PageEditorFormProps) {
    const page = nav.getPage();
    return (
        <div>
        <Typography variant='h5'>{page.text}</Typography>
            {/* <Typography>{page.description}</Typography> */}
            <div>
                <FormLabel component="legend">Page Name</FormLabel>
                <TextField
                    value={page.text}
                />
            </div>
            <Typography variant='h6'>Questions</Typography>
            {page.items.map((question) => {
                return(
                    <QuestionEditorForm
                        editor={editor}
                        nav={nav}
                        question={question as Question}
                    />
                );
            })}
            {/* <QuestionEditorForm
                    editor={editor}
                    nav={nav}
            />
            <QuestionEditorForm
                    editor={editor}
                    nav={nav}
            />
            <QuestionEditorForm
                    editor={editor}
                    nav={nav}
            /> */}
            <Button color="inherit" startIcon={<AddCircleIcon />}>
                Add new question
            </Button>
        </div>
    );
}