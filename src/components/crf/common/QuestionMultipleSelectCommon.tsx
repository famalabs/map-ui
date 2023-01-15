import React from 'react';
import { QuestionCheckMap } from '../../../core/schema'
import { Item, QuestionCheck } from '../../../survey/src'
import { Checkbox, FormControl, FormControlLabel, FormHelperText, FormLabel, Stack, Switch, Typography } from '@mui/material';
import { QuestionCommonProps, QuestionHeaderCommon } from './QuestionCommon';
import { QuestionCheckCommon } from './QuestionCheckCommon';

export function QuestionMultipleSelectCommon({
  index,
  question,
  required,
  value,
  handleOnChange,
  handleOnBlur,
  error,
  helperText,
  disabled
  }: QuestionCommonProps<Item>) {
    
    const checks = question.items as QuestionCheck[];

  return (
    <Stack spacing={1}>
      <QuestionHeaderCommon
        index={index}
        question={question}
        required={required}
      />
      <FormControl fullWidth>
      {checks.map((check,idx) => {
        return (
          <FormControlLabel
          disabled={disabled}
          control={
          <Checkbox 
          checked={value ?? false}
          onChange={(e,c)=>handleOnChange(c)}
          onBlur={handleOnBlur}
          />} 
          label={check.text} 
          // label={value ? 'Si' : 'No'} 
        />
        );
      })}
      </FormControl>
    </Stack>
  );
}