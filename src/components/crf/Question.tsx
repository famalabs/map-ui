import React from 'react';
import { useFormState, InputString, InputNumber, InputRadio, Option, Form, FormNodeType, InputCheck, InputDate  } from '../forms';
import { ButtonLoading } from '../simple';
import { Typography } from '@mui/material';
import {Question, QuestionCheck, QuestionDate, QuestionNumber, QuestionSelect, QuestionText, Survey, SurveyItem} from '../../core/schema'

export interface QuestionProps {
    item: Question;
    value: any;
    setValue: any;
    validators: any;
    requires: any;
    showError: boolean;
}

export function QuestionForm({
    item,
    value,
    setValue,
    validators,
    requires,
    showError,
}: QuestionProps) {
    if (item instanceof QuestionCheck) {
        return null;
    } else if (item instanceof QuestionText) {
        return (
            <InputString
            nameid={item.id}
            label={item.description ?? item.text}
            value={value[item.id]}
            setValue={setValue[item.id]}
            required={item.options.required}
            emptyMessage={'empty message'}
            showError={showError}
            />
        );
    } else if (item instanceof QuestionNumber) {
        return (
            <InputNumber
            nameid={item.id}
            label={item.description ?? item.text}
            value={value[item.id]}
            setValue={setValue[item.id]}
            required={item.options.required}
            emptyMessage={'empty message'}
            showError={showError}
            />
        );
    } else if (item instanceof QuestionDate) {
        return (
            <InputDate
                nameid={item.id}
                title={item.text}
                value={value[item.id]}
                setValue={setValue[item.id]}
                required={item.options.required}
                emptyMessage={'empty message'}
                showError={showError}
            />
        );
    } else if (item instanceof QuestionSelect) {
        return (
            <InputRadio
                nameid={item.id}
                title={''}
                value={value[item.id]}
                options={item.textScoreToOption() as any}
                setValue={setValue[item.id]}
                required={item.options.required}
                emptyMessage={'empty message'}
                showError={showError}
            />
        );
    }
    return null;
}