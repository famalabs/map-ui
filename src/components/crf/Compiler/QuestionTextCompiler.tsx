import React from 'react';
import {QuestionNumberMap, QuestionTextMap, SurveyItem} from '../../../core/schema'
import { TextField, FormLabel, Stack, Typography, Slider, InputAdornment, FormHelperText } from '@mui/material';
import { IUseFormCompiler, useQuestionHandler } from './FormCompiler';

export interface QuestionTextCompilerFormProps {
  index?: number;
  formCompiler: IUseFormCompiler;
  question: SurveyItem;
}

export function QuestionTextCompilerForm({
  index,
  formCompiler,
  question,
  }: QuestionTextCompilerFormProps) {
  const form = formCompiler.form;
  const nav = formCompiler.nav;

  const { value, required, handleOnChange, handleOnBlur, error, helperText } = useQuestionHandler(question, formCompiler);

  // console.log('render number', questionState);
  return (
    <Stack spacing={1}>
      {question.layout.style === QuestionTextMap.layout.style.area ? (
      <Stack spacing={1}>
        <FormLabel component="legend">
        <Typography>{index && (index + '.')} {question.text}{question.options.required && '*'}</Typography>
        </FormLabel>
        <FormLabel component="legend">{question.description}</FormLabel>
        <TextField
          multiline
          label={question.text}
          value={value ?? ''}
          required={required}
          onChange={(e) => handleOnChange(e.target.value)}
          onBlur={handleOnBlur}
          error={error}
          helperText={helperText}
        />
      </Stack>
      ):(
        <Stack spacing={1}>
        <FormLabel component="legend">
        <Typography>{index && (index + '.')} {question.text}{question.options.required && '*'}</Typography>    
        </FormLabel>
        <FormLabel component="legend">{question.description}</FormLabel>
        <TextField
          label={question.text}
          value={value ?? ''}
          required={required}
          onChange={(e) => handleOnChange(e.target.value)}
          onBlur={handleOnBlur}
          error={error}
          helperText={helperText}
        />
      </Stack>
      )}
    </Stack>
  );
}