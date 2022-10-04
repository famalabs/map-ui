import React from 'react';
import { useFormState, InputString, InputNumber, InputRadio, Option, Form } from '../forms';
import { ButtonLoading } from '../simple';
import { Checkbox, FormControl, FormControlLabel, FormHelperText, Paper, Typography } from '@mui/material';
import {Question, QuestionCheck, Survey, SurveyItem} from '../../core/schema'
import { QuestionForm } from './Question';
import { GroupForm } from './Group';
import { SurveyItemForm } from './SurveyItem';

export interface PageProps {
    item: SurveyItem;
    value: any;
    setValue: any;
    validators: any;
    requires: any;
    showError: boolean;
    // onSubmit: (answers: any, allValid: boolean) => void;
}

export function PageForm({
    item,
    value,
    setValue,
    validators,
    requires,
    showError,
    // onSubmit,
}: PageProps) {

    return (
        <Paper style={{margin:'24px',padding:'24px'}}>
            <Typography variant={'h4'}>{item.text}</Typography>
            <Typography>{item.description}</Typography>
            {item.items.map((itm) => (
                <div key={itm.id}>
                    {itm instanceof Question ? (
                        <QuestionForm 
                            item={itm}
                            value={value}
                            setValue={setValue}
                            validators={validators}
                            requires={requires}
                            showError={showError}
                        />
                    ) : itm.type === 'Group' ? (
                        <GroupForm 
                            item={itm}
                            value={value[itm.id]}
                            setValue={setValue[itm.id]}
                            validators={validators[itm.id]}
                            requires={requires[itm.id]}
                            showError={showError} 
                        />
                    ) : null}
                    {/* <SurveyItemForm 
                        item={itm}
                        value={value}
                        setValue={setValue}
                        validators={validators}
                        requires={requires}
                        showError={showError}
                    /> */}
                </div>
            ))}
        </Paper>
    );
}