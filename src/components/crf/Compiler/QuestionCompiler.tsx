import React from 'react';
import { Button, FormLabel, Typography } from '@mui/material';
import { ItemFunction, Question, QuestionCheck, QuestionDate, QuestionNumber, QuestionSelect, QuestionText } from '../../../core/schema';
import { InputDate, InputNumber, InputRadio, InputString } from '../../forms';


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
            title={item.text}
            label={item.description ?? item.text}
            value={value[item.id]}
            setValue={(text) => setValue[item.id](text)}
            required={requires[item.id]}
            // required={item.options.required}
            // emptyMessage={'empty message'}
            showError={showError}
            />
        );
    } else if (item instanceof QuestionNumber) {
        return (
            <InputNumber
            nameid={item.id}
            title={item.text}
            label={item.description ?? item.text}
            value={value[item.id]}
            setValue={(number) => setValue[item.id](number)}
            required={requires[item.id]}
            // required={item.options.required}
            // emptyMessage={'empty message'}
            showError={showError}
            />
        );
    } else if (item instanceof QuestionDate) {
        return (
            <InputDate
                nameid={item.id}
                title={item.text}
                label={item.description ?? item.text}
                value={value[item.id]}
                setValue={(text) => setValue[item.id](text)}
                required={requires[item.id]}
                // required={item.options.required}
                // emptyMessage={'empty message'}
                showError={showError}
            />
        );
    } else if (item instanceof QuestionSelect) {
        return (
            <InputRadio
                nameid={item.id}
                title={item.text}
                value={value[item.id]}
                options={item.textScoreToOption() as any}
                setValue={(radio) => setValue[item.id](radio)}
                required={requires[item.id]}
                // required={item.options.required}
                // emptyMessage={'empty message'}
                showError={showError}
            />
        );
    } 
    else if (item instanceof ItemFunction) {

    } 
    return null;
}