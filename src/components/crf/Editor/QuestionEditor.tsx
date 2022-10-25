import React from 'react';
import {Survey, GroupMap, Question, QuestionText, QuestionNumber, QuestionNumberMap, QuestionSelect, QuestionSelectMap, QuestionDate, QuestionDateMap, QuestionCheckMap, QuestionCheck} from '../../../core/schema'
import { AutoSelect } from '../../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid, Typography, InputLabel, Select, MenuItem, FormLabel, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { OptionsEditorForm } from './OptionsEditor';
import { QuestionMap, QuestionTextMap } from '../../../core/schema';
import { INavState } from '../Navigation';
import { IEditorState } from './EditorBuilder';

export interface QuestionEditorFormProps {
    editor: IEditorState;
    nav: INavState;
    question: Question;
}

export function QuestionEditorForm({
    editor,
    nav,
    question
    }: QuestionEditorFormProps) {
    
    return (
        <Accordion>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="pane21a-content"
            id="panel2a-header"
            >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>Title 1</Typography>
            <Typography sx={{ color: 'text.secondary' }}>Text Question</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <div>
                <FormLabel component="legend">Title</FormLabel>
                <TextField
                    value="Title"
                    required={true}
                />
            </div>
            <div>
                <FormLabel component="legend">Description</FormLabel>
                <TextField
                    value=""
                    required={false}
                />
            </div>
            <OptionsEditorForm
                title="General options"
                options={QuestionMap.options}
            />
            {question instanceof QuestionText ? (
                <OptionsEditorForm
                    title="Text options"
                    options={QuestionTextMap.options}
                />
            ) : question instanceof QuestionNumber ? (
                <OptionsEditorForm
                    title="Number options"
                    options={QuestionNumberMap.options}
                />
            ) : question instanceof QuestionSelect ? (
                <OptionsEditorForm
                    title="Select options"
                    options={QuestionSelectMap.options}
                />
            ) : question instanceof QuestionDate ? (
                <OptionsEditorForm
                    title="Date options"
                    options={QuestionDateMap.options}
                />
            ) : question instanceof QuestionCheck ? (
                <OptionsEditorForm
                    title="Check options"
                    options={QuestionCheckMap.options}
                />
            ) : null}
            
            </AccordionDetails>
        </Accordion>
    );
}