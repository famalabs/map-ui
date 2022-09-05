import React from 'react';
import { useFormState, InputString, InputNumber, InputRadio, Option, Form } from '../forms';
import { ButtonLoading } from '../simple';
import { Typography } from '@mui/material';
import {Question, Survey, SurveyItem} from '../../core/schema'
import { QuestionForm } from './Question';

function renderItem(item:SurveyItem) {

    if (item instanceof Question) {
        return (
            <QuestionForm item={item}/>
        );
    }

    if (item.items.length != 0) {
        return (
            <div>
                <Typography>{item.text}</Typography>
                <Typography>{item.description}</Typography>
                <Typography>{item.type}</Typography>
                {item.items.map((itm) => (
                    <div key={itm.id}>
                        <SurveyItemForm item={itm} />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <Typography>{item.text}</Typography>
            <Typography>{item.description}</Typography>
            <Typography>{item.type}</Typography>
        </div>
    );
}

export interface SurveyItemProps {
    item: SurveyItem;
}

export function SurveyItemForm({
    item,
}: SurveyItemProps) {
    return (
        <div>
            {renderItem(item)}
        </div>
    );
}