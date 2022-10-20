import React from 'react';
import {Survey, GroupMap} from '../../../core/schema'
import { AutoSelect } from '../../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid, Typography, InputLabel, Select, MenuItem, FormLabel, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { PageEditorForm } from './PageEditor';

export interface FolderEditorFormProps {
    
}

export function FolderEditorForm({
    
    }: FolderEditorFormProps) {
    
    return (
        <div>
                <Typography variant='h4'>Folder 1</Typography>
                <div>
                    <FormLabel component="legend">Folder Name</FormLabel>
                    <TextField
                        value="Folder 1"
                    />
                </div>
                <PageEditorForm
                />
        </div>
    );
}