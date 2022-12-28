import React from 'react';
import { QuestionCheckMap } from '../../../core/schema'
import { QuestionCheck } from '../../../survey'
import { Checkbox, FormControlLabel, FormHelperText, FormLabel, Stack, Switch, Typography } from '@mui/material';
import { QuestionCommonProps, QuestionHeaderCommon } from './QuestionCommon';

export function QuestionCheckCommon({
  index,
  question,
  required,
  value,
  handleOnChange,
  handleOnBlur,
  error,
  helperText,
  disabled
  }: QuestionCommonProps<QuestionCheck>) {
    
  return (
    <Stack spacing={1}>
      <QuestionHeaderCommon
        index={index}
        question={question}
        required={required}
      />
      {question.layout.style === QuestionCheckMap.layout.style.switch ? (
        <FormControlLabel
          disabled={disabled}
          control={
          <Switch 
          checked={value ?? false}
          onChange={(e,c)=>handleOnChange(c)}
          onBlur={handleOnBlur}
          />} 
          label={value ? 'Si' : 'No'} 
        />
      ):(
        <FormControlLabel
          disabled={disabled}
          control={
          <Checkbox 
          checked={value ?? false}
          onChange={(e,c)=>handleOnChange(c)}
          onBlur={handleOnBlur}
          />} 
          label={value ? 'Si' : 'No'} 
        />
      )}
      <FormHelperText>{error && helperText}</FormHelperText>
    </Stack>
  );
}