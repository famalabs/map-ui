import React from 'react';
import { useFormState, InputString, InputNumber, InputRadio, Option, Form } from '../forms';
import { ButtonLoading } from '../simple';
import { Box, Checkbox, FormControl, FormControlLabel, FormHelperText, Paper, Typography } from '@mui/material';
import {Question, QuestionCheck, Survey, SurveyItem} from '../../core/schema'
import { QuestionForm } from './Question';
// import { SurveyItemForm } from './SurveyItem';
import { PageForm } from './Page';


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
            // TODO: requires function only on first and not function setvalue
            return (
                <div style={{marginTop:'12px',paddingTop:'12px'}}>
                    <Typography>{item.text}</Typography>
                    <FormControl>
                        <FormHelperText>{item.description}</FormHelperText>
                        {item.items.map((itm) => (
                            <FormControlLabel control={
                                <Checkbox onChange={(event)=>{setValue[itm.id](event.target.value)}} />
                            } label={itm.text} key={itm.id}/> 
                        ))}
                    </FormControl>
                </div>
            );
        } else {
            return (
                <div>
                    <Typography variant={'h5'}>{item.text}</Typography>
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
                            // <GroupForm 
                            //     item={itm}
                            //     value={value[item.id]}
                            //     setValue={setValue[item.id]}
                            //     validators={validators[item.id]}
                            //     requires={requires[item.id]}
                            //     showError={showError} 
                            // />
                            null
                        ) : null}
                        </div>
                    ))}
                </div>
            );
        }
    }

    return null;
}