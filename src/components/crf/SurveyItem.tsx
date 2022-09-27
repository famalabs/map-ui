import React from 'react';
import { useFormState, InputString, InputNumber, InputRadio, Option, Form } from '../forms';
import { ButtonLoading } from '../simple';
import { Paper, Typography } from '@mui/material';
import {Question, Survey, SurveyItem} from '../../core/schema'
import { QuestionForm } from './Question';
import { GroupForm } from './Group';

export interface SurveyItemProps {
    item: SurveyItem;
    value: any;
    setValue: any;
    validators: any;
    requires: any;
    showError: boolean;
    // onSubmit: (answers: any, allValid: boolean) => void;
}

export function SurveyItemForm({
    item,
    value,
    setValue,
    validators,
    requires,
    showError,
    // onSubmit,
}: SurveyItemProps) {

    if (item instanceof Question) {
        return (
            <QuestionForm 
                item={item}
                value={value}
                setValue={setValue}
                validators={validators}
                requires={requires}
                showError={showError}
            />
        );
    }
    if (item.type === 'Group') {
        return (
            <GroupForm 
                item={item}
                value={value}
                setValue={setValue}
                validators={validators}
                requires={requires}
                showError={showError} 
            />);
    }

    if (item.items.length != 0) {
        if (item.type === 'Survey') {
            return (
                <Paper style={{margin:'24px',padding:'24px'}}>
                    <Typography variant={(item.type === 'Survey' ? 'h3' : 'h4')}>{item.text}</Typography>
                    <Typography>{item.description}</Typography>
                    {item.items.map((itm) => (
                        <div key={itm.id}>
                            <SurveyItemForm 
                                item={itm}
                                value={value}
                                setValue={setValue}
                                validators={validators}
                                requires={requires}
                                showError={showError}
                                // onSubmit={(answers, allValid) => console.log(answers)}
                            />
                        </div>
                    ))}
                </Paper>
            );
        }
    }

    return null;
}