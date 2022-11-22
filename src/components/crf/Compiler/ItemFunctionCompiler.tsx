import React from 'react';
import { Button, FormLabel, Typography } from '@mui/material';
import { AdapterUseFormStateSurvey, ItemFunction } from '@src/core/schema';


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
            if (item.hasValidParams()) computeValue(item.compute());
        };
        return (
            <div>
                {item.text === '' ? null : <FormLabel component="legend">{item.text ?? item.id}</FormLabel>}
                <Button color="inherit" onClick={(e) => {computeFnValue();}}>
                    Calcola {item.text}
                </Button>
                <Typography>{value[item.id].toString()}</Typography>
            </div>
        );
    } 
    return null;
}