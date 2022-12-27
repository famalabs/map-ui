import React from 'react';
import { QuestionDate } from '../../../survey'
import { Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { QuestionCommonProps, QuestionHeaderCommon } from './QuestionCommon';

export function QuestionDateCommon({
  index,
  question,
  required,
  value,
  handleOnChange,
  handleOnBlur,
  error,
  helperText,
  disabled
  }: QuestionCommonProps<QuestionDate>) {

    
  return (
    <Stack spacing={1}>
      <QuestionHeaderCommon
        index={index}
        question={question}
        required={required}
      />
      <DatePicker
          // disableFuture
          disabled={disabled}
          label={question.text}
          openTo="year"
          views={['year', 'month', 'day']}
          value={value ?? ''}
          onChange={(newValue) => {handleOnChange(newValue)}}
          renderInput={(params) => <TextField {...params} />}
        />
    </Stack>
  );
}