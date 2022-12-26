import React from 'react';
import {QuestionNumber, QuestionNumberMap } from '../../../core/schema'
import {Item} from '../../../core/schema'
import { TextField, FormLabel, Stack, Typography, Slider, InputAdornment, FormHelperText } from '@mui/material';
import { IUseFormCompiler, useQuestionHandler } from './FormCompiler';

export interface QuestionNumberCompilerFormProps {
  index: number;
  formCompiler: IUseFormCompiler;
  question: Item;
}

export function QuestionNumberCompilerForm({
  index,
  formCompiler,
  question,
  }: QuestionNumberCompilerFormProps) {
  const form = formCompiler.form;
  const nav = formCompiler.nav;

  const { value, required, handleOnChange, handleOnBlur, error, helperText } = useQuestionHandler(question, formCompiler);

  // console.log('render number', questionState);
  return (
    <Stack spacing={1}>
      {question.layout.style === QuestionNumberMap.layout.style.range ? (
      <Stack spacing={1}>
        <FormLabel component="legend">
        <Typography>{index && (index + '.')} {question.text}{question.options.required && '*'}</Typography>  
        </FormLabel>
        <FormLabel component="legend">{question.description}</FormLabel>
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
          {required && (<Typography>*</Typography>)}
          <Typography>{
          question.options.unit === QuestionNumberMap.options.unit.none ?
          '' : QuestionNumberMap.options.unit[question.options.unit]}</Typography>
          <Typography>{question.options.minValue}</Typography>
          <Slider
          step={question.options.step}
          marks
          min={question.options.minValue}
          max={question.options.maxValue}
          value={value ?? question.options.minValue}
          // required={required}
          onChange={(e,v,at) => handleOnChange(v)}
          onBlur={handleOnBlur}
          // error={error}
          // helperText={helperText}
           />
           <FormHelperText>{error && helperText}</FormHelperText>
          <Typography>{question.options.maxValue}</Typography>
        </Stack>
      </Stack>
      ):(
        <Stack spacing={1}>
        <FormLabel component="legend">
        <Typography>{index && (index + '.')} {question.text}{question.options.required && '*'}</Typography>    
        </FormLabel>
        <FormLabel component="legend">{question.description}</FormLabel>
        <TextField
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
              question.options.unit === QuestionNumberMap.options.unit.none ?
              '' : QuestionNumberMap.options.unit[question.options.unit]}</InputAdornment>,
          }}
        />
      </Stack>
      )}
    </Stack>
  );
}