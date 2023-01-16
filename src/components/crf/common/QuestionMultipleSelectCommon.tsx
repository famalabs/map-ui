import React from 'react';
import { QuestionCheckMap } from '../../../core/schema'
import { Item, QuestionCheck } from '../../../survey/src'
import { Checkbox, FormControl, FormControlLabel, FormHelperText, FormLabel, Stack, Switch, Typography } from '@mui/material';
import { QuestionCommonProps, QuestionHeaderCommon } from './QuestionCommon';
import { QuestionCheckCommon } from './QuestionCheckCommon';
import { IUseFormCompiler, useQuestionHandler } from '../Compiler';

export interface QuestionMultipleSelectommonProps extends QuestionCommonProps<Item> {
  formCompiler?: IUseFormCompiler;
}

export function QuestionMultipleSelectCommon({
  index,
  question,
  required,
  value,
  handleOnChange,
  handleOnBlur,
  error,
  helperText,
  disabled,
  formCompiler,
  }: QuestionMultipleSelectommonProps) {
    
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
        if (typeof formCompiler !== 'undefined') {
          const { value, required, handleOnChange, handleOnBlur, error, helperText } = useQuestionHandler(check, formCompiler);  
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
        }
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