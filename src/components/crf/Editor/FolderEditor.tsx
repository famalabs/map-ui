import React from 'react';
import {Survey, GroupMap} from '../../../core/schema'
import { AutoSelect } from '../../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid, Typography, InputLabel, Select, MenuItem, FormLabel, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { PageEditorForm } from './PageEditor';
import { INavState } from '../Navigation';
import { IEditorState } from './EditorBuilder';

export interface FolderEditorFormProps {
    editor: IEditorState;
    nav: INavState;
}

export function FolderEditorForm({
    editor,
    nav
    }: FolderEditorFormProps) {
    const folder = nav.getFolder();
    return (
        <div>
        <Typography variant='h4'>{folder.text}</Typography>
                {/* <Typography>{folder.description}</Typography> */}
                <div>
                    <FormLabel component="legend">Folder Name</FormLabel>
                    <TextField
                        value={folder.text}
                    />
                </div>
                <PageEditorForm
                    editor={editor}
                    nav={nav}
                />
        </div>
    );
}