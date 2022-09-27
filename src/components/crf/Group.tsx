import React from 'react';
import { useFormState, InputString, InputNumber, InputRadio, Option, Form, InputCheck } from '../forms';
import { ButtonLoading } from '../simple';
import { Box, Checkbox, FormControl, FormControlLabel, FormHelperText, Paper, Typography } from '@mui/material';
import {Question, QuestionCheck, Survey, SurveyItem} from '../../core/schema'
import { QuestionForm } from './Question';
import { SurveyItemForm } from './SurveyItem';


export interface GroupProps {
    item: SurveyItem;
    value: any;
    setValue: any;
    validators: any;
    requires: any;
    showError: boolean;
}

export function GroupForm({
    item,
    value,
    setValue,
    validators,
    requires,
    showError,
}: GroupProps) {
    if (item.items.length != 0) {
        if (item.items[0] instanceof QuestionCheck) {
            return (
                <div style={{marginTop:'12px',paddingTop:'12px'}}>
                    <Typography>{item.text}</Typography>
                    <FormControl>
                        <FormHelperText>{item.description}</FormHelperText>
                        {item.items.map((itm) => (
                            <FormControlLabel control={<Checkbox />} label={itm.text} key={itm.id}/> 
                        ))}
                    </FormControl>
                </div>
            );
        } else {
            return (
                <Paper style={{margin:'24px',padding:'24px'}}>
                    <Typography variant={(item.items[0].type === 'Group' ? 'h4' : 'h5')}>{item.text}</Typography>
                    <Typography>{item.description}</Typography>
                    {/* <Typography>{item.type}</Typography> */}
                    {item.items.map((itm) => (
                        <div key={itm.id}>
                            <SurveyItemForm 
                                item={itm}
                                value={value}
                                setValue={setValue}
                                validators={validators}
                                requires={requires}
                                showError={showError}
                            />
                        </div>
                    ))}
                </Paper>
            );
        }
    }

    return null;
}