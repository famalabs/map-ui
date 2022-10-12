import React from 'react';
import {Survey, SurveyMap} from '../../core/schema'
import { AutoSelect } from '../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid, Typography, InputLabel, Select, MenuItem } from '@mui/material';

export interface SurveyEditorProps {
    // saveSurvey: (survey: Survey) => void;
    // initSurvey?: Survey;
    // addQuestionLabel?: string;
    // saveSurveyLabel?: string;
}

export function SurveyEditorForm({
    // saveSurvey,
    // initSurvey = emptyObj,
    // addQuestionLabel = 'Add question',
    // saveSurveyLabel = 'Save survey',
    }: SurveyEditorProps) {
    // const [questions, setQuestions] = React.useState<Question[]>(Object.values(initSurvey));
    
    return (
        <div>
            <div>
                <Typography>options:</Typography>
                {Object.keys(SurveyMap.options).map((key, idx) => {
                    return (
                        <div>
                            <FormControl fullWidth>
                            <InputLabel>{key}</InputLabel>
                            <Select
                                // value={0}
                                label={key}
                                onChange={null}
                            >
                                {Object.keys(SurveyMap.options[key]).map((key1, idx1) => {
                                    return (
                                        <MenuItem value={key1}>{key1}</MenuItem>
                                    );
                                } )}
                            </Select>
                            </FormControl>
                        </div>
                    );
                })}
                <Typography>layout:</Typography>
                {Object.keys(SurveyMap.layout).map((key, idx) => {
                    return (
                        <div>
                            <FormControl fullWidth>
                            <InputLabel>{key}</InputLabel>
                            <Select
                                // value={0}
                                label={key}
                                onChange={null}
                            >
                                {Object.keys(SurveyMap.layout[key]).map((key1, idx1) => {
                                    return (
                                        <MenuItem value={key1}>{key1}</MenuItem>
                                    );
                                } )}
                            </Select>
                            </FormControl>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}