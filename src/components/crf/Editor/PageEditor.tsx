import React from 'react';
import {Survey, GroupMap} from '../../../core/schema'
import { AutoSelect } from '../../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid, Typography, InputLabel, Select, MenuItem, FormLabel, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { QuestionEditorForm } from './QuestionEditor';

export interface PageEditorFormProps {
    
}

export function PageEditorForm({
    
    }: PageEditorFormProps) {
    
    return (
        <div>
            <Typography variant='h5'>Page 1</Typography>
            <div>
                <FormLabel component="legend">Page Name</FormLabel>
                <TextField
                    value="Page 1"
                />
            </div>
            <Typography variant='h6'>Questions</Typography>
            <QuestionEditorForm
            />
            <QuestionEditorForm
            />
            <QuestionEditorForm
            />
            <Button color="inherit" startIcon={<AddCircleIcon />}>
                Add new question
            </Button>
        </div>
    );
}