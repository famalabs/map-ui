import React from 'react';
import {Survey, GroupMap} from '../../../core/schema'
import { AutoSelect } from '../../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid, Typography, InputLabel, Select, MenuItem, FormLabel, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { OptionsEditorForm } from './OptionsEditor';
import { QuestionMap, QuestionTextMap } from '../../../core/schema';

export interface QuestionEditorFormProps {
    
}

export function QuestionEditorForm({
    
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
            <OptionsEditorForm
                title="Text options"
                options={QuestionTextMap.options}
            />
            </AccordionDetails>
        </Accordion>
    );
}