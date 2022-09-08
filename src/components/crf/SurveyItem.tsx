import React from 'react';
import { useFormState, InputString, InputNumber, InputRadio, Option, Form } from '../forms';
import { ButtonLoading } from '../simple';
import { Paper, Typography } from '@mui/material';
import {Question, Survey, SurveyItem} from '../../core/schema'
import { QuestionForm } from './Question';
import { GroupForm } from './Group';

function renderItem(item:SurveyItem) {

    if (item instanceof Question) {
        return (
            <QuestionForm item={item}/>
        );
    }
    if (item.type === 'Group') {
        return (<GroupForm item={item} />)
    }

    if (item.items.length != 0) {
        return (
            <Paper style={{margin:'24px',padding:'24px'}}>
                <Typography variant={(item.type === 'Survey' ? 'h3' : 'h4')}>{item.text}</Typography>
                <Typography>{item.description}</Typography>
                {/* <Typography>{item.type}</Typography> */}
                {item.items.map((itm) => (
                    <div key={itm.id}>
                        <SurveyItemForm item={itm} />
                    </div>
                ))}
            </Paper>
        );
    }

    return (
        <Paper style={{margin:'24px',padding:'24px'}}>
            <Typography variant={(item.type === 'Survey' ? 'h3' : 'h4')}>{item.text}</Typography>
            <Typography>{item.description}</Typography>
            {/* <Typography>{item.type}</Typography> */}
        </Paper>
    );
}

export interface SurveyItemProps {
    item: SurveyItem;
}

export function SurveyItemForm({
    item,
}: SurveyItemProps) {
    return renderItem(item);
}