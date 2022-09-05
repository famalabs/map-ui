import React from 'react';
import { Survey, Question, QuestionSelect } from '../survey/SurveyForm';
import { AutoSelect } from '../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid } from '@mui/material';

export interface SurveyEditorProps {
    saveSurvey: (survey: Survey) => void;
    initSurvey?: Survey;
    addQuestionLabel?: string;
    saveSurveyLabel?: string;
}

const emptyObj = {};

export function SurveyEditorForm({
    saveSurvey,
    initSurvey = emptyObj,
    addQuestionLabel = 'Add question',
    saveSurveyLabel = 'Save survey',
    }: SurveyEditorProps) {
    
    return (
        <div>hello world</div>
    );
}