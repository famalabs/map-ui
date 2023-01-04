import React from 'react';
import { QuestionTextMap } from '../../../core/schema'
import { QuestionText } from '../../../survey'
import { TextField, FormLabel, Stack, Typography } from '@mui/material';
import { QuestionCommonProps, QuestionHeaderCommon } from './QuestionCommon';

export function QuestionTextCommon({
  index,
  question,
  required,
  value,
  handleOnChange,
  handleOnBlur,
  error,
  helperText,
  disabled
  }: QuestionCommonProps<QuestionText>) {
    
  return (
    <Stack spacing={1}>
      <QuestionHeaderCommon
        index={index}
        question={question}
        required={required}
      />
      {question.layout.style === QuestionTextMap.layout.style.area ? (
        <TextField
          multiline
          disabled={disabled}
          // label={question.text}
          value={value ?? ''}
          required={required}
          onChange={(e) => handleOnChange(e.target.value)}
          onBlur={handleOnBlur}
          error={error}
          helperText={helperText}
        />
      ):(
        <TextField
          disabled={disabled}
          // label={question.text}
          value={value ?? ''}
          required={required}
          onChange={(e) => handleOnChange(e.target.value)}
          onBlur={handleOnBlur}
          error={error}
          helperText={helperText}
        />
      )}
    </Stack>
  );
}