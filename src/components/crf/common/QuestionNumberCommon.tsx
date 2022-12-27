import React from 'react';
import { QuestionNumberMap } from '../../../core/schema'
import { QuestionNumber } from '../../../survey'
import { FormHelperText, InputAdornment, Slider, Stack, TextField, Typography } from '@mui/material';
import { QuestionCommonProps, QuestionHeaderCommon } from './QuestionCommon';

export function QuestionNumberCommon({
  index,
  question,
  required,
  value,
  handleOnChange,
  handleOnBlur,
  error,
  helperText,
  disabled
  }: QuestionCommonProps<QuestionNumber>) {
    
  return (
    <Stack spacing={1}>
      <QuestionHeaderCommon
        index={index}
        question={question}
        required={required}
      />
      {question.layout.style === QuestionNumberMap.layout.style.range ? (
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
          {/* {required && (<Typography>*</Typography>)} */}
          <Typography>{
          question.options.unit === undefined ?
          '' : QuestionNumberMap.options.unit[question.options.unit]}</Typography>
          <Typography>{question.options.min}</Typography>
          <Slider
          disabled={disabled}
          step={question.options.step}
          marks
          min={question.options.min}
          max={question.options.max}
          value={value ?? question.options.min}
          // required={required}
          onChange={(e,v,at) => handleOnChange(v)}
          onBlur={handleOnBlur}
          // error={error}
          // helperText={helperText}
           />
           <FormHelperText>{error && helperText}</FormHelperText>
          <Typography>{question.options.max}</Typography>
        </Stack>
      ):(
        <TextField
          disabled={disabled}
          type="number"
          label={question.text}
          value={value ?? ''}
          required={required}
          onChange={(e) => handleOnChange(e.target.value)}
          onBlur={handleOnBlur}
          error={error}
          helperText={helperText}
          InputProps={{
            startAdornment: <InputAdornment position="start">{
              question.options.unit === undefined ?
              '' : QuestionNumberMap.options.unit[question.options.unit]}</InputAdornment>,
          }}
        />
      )}
    </Stack>
  );
}