import React from 'react';
import {Survey, SurveyMap} from '../../../core/schema'
import { AutoSelect } from '../../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid, Typography, InputLabel, Select, MenuItem, FormLabel, Accordion, AccordionSummary, AccordionDetails, Box, CssBaseline } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { OptionsEditorForm } from './OptionsEditor';
import { FolderEditorForm } from './FolderEditor';
import { SidebarEditorForm } from './SidebarEditor';

export interface SurveyEditorProps {
    saveSurvey: (survey: Survey) => void;
    // initSurvey?: Survey;
    // addQuestionLabel?: string;
    // saveSurveyLabel?: string;
}

export function SurveyEditorForm({
    saveSurvey,
    // initSurvey = emptyObj,
    // addQuestionLabel = 'Add question',
    // saveSurveyLabel = 'Save survey',
    }: SurveyEditorProps) {
    // const [questions, setQuestions] = React.useState<Question[]>(Object.values(initSurvey));

    // const [schema, setSchema] = React.useState(Object.values())
    
    return (
        <Box sx={{ display: 'flex', width:'100%' }}>
            <CssBaseline />
            <SidebarEditorForm
            />
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${320}px)` } }}
            >
                <Paper style={{margin:'24px',padding:'24px'}}>
                    <FolderEditorForm
                    />
                </Paper>
            </Box>

        </Box>

    );
}