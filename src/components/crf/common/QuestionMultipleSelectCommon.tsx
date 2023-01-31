import React from 'react';
import { QuestionCheckMap } from '../../forms'
import { Item, QuestionCheck } from '../../../survey/src'
import { Checkbox, FormControl, FormControlLabel, FormHelperText, FormLabel, Stack, Switch, Typography } from '@mui/material';
import { QuestionCommonProps, QuestionHeaderCommon } from './QuestionCommon';
import { QuestionCheckCommon } from './QuestionCheckCommon';
import { IUseFormCompiler, useQuestionHandler } from '../Compiler';

export interface QuestionMultipleSelectommonProps extends QuestionCommonProps<Item> {
  // formCompiler?: IUseFormCompiler;
  useQuestionHandler?:any;
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
  useQuestionHandler,
  }: QuestionMultipleSelectommonProps) {
    
    const checks = question.items as QuestionCheck[];

  return (
    <Stack spacing={1}>
      <QuestionHeaderCommon
        index={index[question.id]}
        question={question}
        required={required}
      />
      <FormControl fullWidth>
      {checks.map((check,idx) => {
        if (typeof useQuestionHandler !== 'undefined') {
          const { value, required, handleOnChange, handleOnBlur, error, helperText } = useQuestionHandler(check);  
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