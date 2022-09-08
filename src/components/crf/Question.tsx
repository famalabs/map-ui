import React from 'react';
import { useFormState, InputString, InputNumber, InputRadio, Option, Form, FormNodeType, InputCheck, InputDate  } from '../forms';
import { ButtonLoading } from '../simple';
import { Typography } from '@mui/material';
import {Question, QuestionCheck, QuestionDate, QuestionNumber, QuestionSelect, QuestionText, Survey, SurveyItem} from '../../core/schema'

function renderCheck(item:QuestionCheck) {
    return (
        <InputCheck
            nameid={item.id}
            title={item.text}
            value={null}
            setValue={(value:FormNodeType) => console.log(value)}
            required={item.options.required}
            emptyMessage={'empty message'}
            showError={true}
        />
    );
}
function renderText(item:QuestionText) {
    return (
        <InputString
        nameid={item.id}
        label={''}
        value={null}
        setValue={(value:string) => console.log(value)}
        required={item.options.required}
        emptyMessage={'empty message'}
        showError={true}
        />
    );
}
function renderNumber(item:QuestionNumber) {
    return (
        <InputNumber
        nameid={item.id}
        label={''}
        value={null}
        setValue={(value:number) => console.log(value)}
        required={item.options.required}
        emptyMessage={'empty message'}
        showError={true}
        />
    );
}
function renderDate(item:QuestionDate) {
    return (
        <InputDate
            nameid={item.id}
            title={item.text}
            value={null}
            setValue={(value:FormNodeType) => console.log(value)}
            required={item.options.required}
            emptyMessage={'empty message'}
            showError={true}
        />
    );
}
function renderSelect(item:QuestionSelect) {
    return (
        <InputRadio
            nameid={item.id}
            title={''}
            value={null}
            options={item.textScoreToOption() as any}
            setValue={(value:FormNodeType) => console.log(value)}
            required={item.options.required}
            emptyMessage={'empty message'}
            showError={true}
        />
    );
}

function renderQuestion(item:Question) {

    if (item instanceof QuestionCheck) {
        return renderCheck(item);
    } else if (item instanceof QuestionText) {
        return renderText(item);
    } else if (item instanceof QuestionNumber) {
        return renderNumber(item);
    } else if (item instanceof QuestionDate) {
        return renderDate(item);
    } else if (item instanceof QuestionSelect) {
        return renderSelect(item);
    }

    if (item.items.length != 0) {
        return (
            <div>
                ######## I HAVE CHILD
            </div>
        );
    }

    return null;
}

export interface QuestionProps {
    item: Question;
}

export function QuestionForm({
    item,
}: QuestionProps) {
    return (
        <div style={{marginTop:'12px',paddingTop:'12px'}}>
            <Typography>{item.text}</Typography>
            <Typography>{item.description}</Typography>
            {/* <Typography>{item.type}</Typography> */}
            {renderQuestion(item)}
        </div>
        );
}