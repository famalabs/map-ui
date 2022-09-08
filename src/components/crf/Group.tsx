import React from 'react';
import { useFormState, InputString, InputNumber, InputRadio, Option, Form, InputCheck } from '../forms';
import { ButtonLoading } from '../simple';
import { Box, Checkbox, FormControl, FormControlLabel, FormHelperText, Paper, Typography } from '@mui/material';
import {Question, QuestionCheck, Survey, SurveyItem} from '../../core/schema'
import { QuestionForm } from './Question';
import { SurveyItemForm } from './SurveyItem';

function renderItem(item:SurveyItem) {

    if (item.items.length != 0) {
        if (item.items[0] instanceof QuestionCheck) {
            return (
                <div style={{marginTop:'12px',paddingTop:'12px'}}>
                    <Typography>{item.text}</Typography>
                    {/* <Typography>{item.description}</Typography> */}
                    {/* <Typography>{item.type}</Typography> */}
                    <FormControl>
                        <FormHelperText>{item.description}</FormHelperText>
                        {item.items.map((itm) => (
                            <FormControlLabel control={<Checkbox defaultChecked />} label={itm.text} key={itm.id}/> 
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
                            <SurveyItemForm item={itm} />
                        </div>
                    ))}
                </Paper>
            );
        }
    }

    return (
        <Paper style={{margin:'24px',padding:'24px'}}>
            <Typography variant='h4'>{item.text}</Typography>
            <Typography>{item.description}</Typography>
            {/* <Typography>{item.type}</Typography> */}
        </Paper>
    );
}

export interface GroupProps {
    item: SurveyItem;
}

export function GroupForm({
    item,
}: GroupProps) {
    return renderItem(item);
}