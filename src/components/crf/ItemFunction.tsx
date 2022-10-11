import React from 'react';
import { useFormState, InputString, InputNumber, InputRadio, Option, Form, FormNodeType, InputDate  } from '../forms';
import { ButtonLoading } from '../simple';
import { Button, FormLabel, Typography } from '@mui/material';
import {AdapterUseFormStateSurvey, ItemFunction, Question, QuestionCheck, QuestionDate, QuestionNumber, QuestionSelect, QuestionText, Survey, SurveyItem} from '../../core/schema'


export interface ItemFunctionProps<T> {
    item: ItemFunction<T>;
    value: any;
    setValue: any;
    validators: any;
    requires: any;
    showError: boolean;
}

export function ItemFunctionForm<T>({
    item,
    value,
    setValue,
    validators,
    requires,
    showError,
}: ItemFunctionProps<T>) {
    if (item instanceof ItemFunction) {
        const computeValue = (res) => setValue[item.id](res);
        const computeFnValue = () => {
            AdapterUseFormStateSurvey.setValuesFromUseFormState(item.parent, value);
            console.log(item.toUseFormState());
            computeValue(item.compute());
        };
        return (
            <div>
                {item.text === '' ? null : <FormLabel component="legend">{item.text ?? item.id}</FormLabel>}
                {/* <Button color="inherit" onClick={(e) => {console.log(item.compute())}}>
                    Calcola {item.text}
                </Button>
                <Button color="inherit" onClick={(e) => {console.log(item.getResult())}}>
                    Calcola {item.text}
                </Button>
                <Button color="inherit" onClick={(e) => {console.log(item.parameters)}}>
                    Calcola {item.text}
                </Button>
                <Button color="inherit" onClick={(e) => {console.log(item.getParam("952"),item.getParam("953"))}}>
                    Calcola {item.text}
                </Button>
                <Button color="inherit" onClick={(e) => {console.log(item.hasValidParams())}}>
                    Calcola {item.text}
                </Button> */}
                <Button color="inherit" onClick={(e) => {computeFnValue();}}>
                    Calcola {item.text}
                </Button>
                <Typography>{value[item.id].toString()}</Typography>
            </div>
        );
    } 
    return null;
}