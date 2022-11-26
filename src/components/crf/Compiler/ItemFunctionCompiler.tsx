import React from 'react';
import { Button, FormLabel, Typography } from '@mui/material';
import { AdapterUseFormStateSurvey, ItemFunction, SurveyItem } from '../../../core/schema';
import { IUseFormCompiler, useQuestionHandler } from './FormCompiler';


export interface ItemFunctionCompilerProps {
    formCompiler: IUseFormCompiler;
    item: SurveyItem;
}

export function ItemFunctionCompilerForm({
    formCompiler,
    item,
}: ItemFunctionCompilerProps) {
    const form = formCompiler.form;
    const nav = formCompiler.nav;
  
    const { value, required, handleOnChange, handleOnBlur, error, helperText } = useQuestionHandler(item, formCompiler);
  
    if (item instanceof ItemFunction) {
        const computeValue = (res) => form.getSetValue(item.id)(res);
        const computeFnValue = () => {
            // AdapterUseFormStateSurvey.setValuesFromUseFormState(item.parent, value);
            console.log(item.toUseFormState());
            if (item.hasValidParams()) computeValue(item.compute());
        };
        return (
            <div>
                {item.text === '' ? null : <FormLabel component="legend">{item.text ?? item.id}</FormLabel>}
                <Button color="inherit" onClick={(e) => {computeFnValue();}}>
                    Calcola {item.text}
                </Button>
                <Typography>{value.toString()}</Typography>
            </div>
        );
    } 
    return null;
}