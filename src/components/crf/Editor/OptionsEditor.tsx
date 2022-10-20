import React from 'react';
import {Survey, SurveyMap} from '../../../core/schema'
import { AutoSelect } from '../../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid, Typography, InputLabel, Select, MenuItem, FormLabel, Accordion, AccordionSummary, AccordionDetails, Checkbox } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface OptionsEditorFormProps {
    title: string;
    options: any;
}

export function OptionsEditorForm({
    title,
    options,
    }: OptionsEditorFormProps) {
    
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
                    if (['required','inverted','toggle'].includes(key)) {
                        return (
                            <FormControlLabel control={<Checkbox />} label={key} />
                        );
                    } else if (key.includes('min') || key.includes('max') || ['step'].includes(key) ) {
                        return (
                            <div>
                                <FormLabel component="legend">{key}</FormLabel>
                                <TextField
                                    value=""
                                />
                            </div>
                        );
                    } else {
                        return (
                            <div>
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
                                                <MenuItem value={key1}>{key1}</MenuItem>
                                            );
                                        }
                                    } )}
                                </Select>
                                </FormControl>
                            </div>
                        );
                    }
            })}
            </AccordionDetails>
        </Accordion>
    );
}