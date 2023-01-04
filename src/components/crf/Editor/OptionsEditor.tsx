import React from 'react';
import { TextField, FormControlLabel, FormControl, Typography, InputLabel, Select, MenuItem, FormLabel, Accordion, AccordionSummary, AccordionDetails, Checkbox, Stack } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IEditorState } from './EditorBuilder';

export const renderSelectOption = (option:any, name:string, value:any, editor:IEditorState, id:string, key:string) => {
    return (
    <FormControl fullWidth>
    <InputLabel>{name}</InputLabel>
    <Select
        value={value}
        label={name}
        onChange={(e) => {editor.onChangeValue(id,key, e.target.value)}}
    >
        {Object.keys(option).map((key1, idx1) => {
            if (key1 === 'default') {
                // return null;
            } else {
                return (
                    <MenuItem key={key1} value={key1}>{option[key1]}</MenuItem>
                );
            }
        } )}
    </Select>
    </FormControl>

    );
}

const renderOptions = (options:any, key:any) => {
    if (['required','inverted','toggle'].includes(key)) {
        return (
            <FormControlLabel key={key} control={<Checkbox />} label={key} />
        );
    } else if (key.includes('min') || key.includes('max') || ['step'].includes(key) ) {
        return (
            <div key={key}>
                <FormLabel component="legend">{key}</FormLabel>
                <TextField
                    value=""
                />
            </div>
        );
    } else {
        return (
            <div key={key}>
                <FormControl fullWidth>
                <InputLabel>{key}</InputLabel>
                <Select
                    value={options[key].default}
                    label={key}
                    onChange={null}
                >
                    {Object.keys(options[key]).map((key1, idx1) => {
                        if (key1 === 'default') {
                            return null;
                        } else {
                            return (
                                <MenuItem key={key1} value={key1}>{key1}</MenuItem>
                            );
                        }
                    } )}
                </Select>
                </FormControl>
            </div>
        );
    }
}

export interface OptionsEditorFormProps {
    title: string;
    options: any;
    useAccordion?: boolean;
}

export function OptionsEditorForm({
    title,
    options,
    useAccordion=true,
    }: OptionsEditorFormProps) {
    
    if (useAccordion) {
        return (
            <Accordion>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="pane21a-content"
            id="panel2a-header"
            >
            <Typography>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
            {Object.keys(options).map((key, idx) => {
                return renderOptions(options,key);
            })}
            </AccordionDetails>
        </Accordion>
        );
    } else {
        return (
            <Stack>
            <Typography>{title}</Typography>
            {Object.keys(options).map((key, idx) => {
                return renderOptions(options,key);
            })}
            </Stack>
        );
    }
    
    return null;
}