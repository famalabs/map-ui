import React from 'react';
import {QuestionCheckMap, SurveyItem} from '../../../core/schema'
import { FormLabel, Stack, Switch, Checkbox, FormControlLabel, FormHelperText } from '@mui/material';
import { IUseFormCompiler, useQuestionHandler } from './FormCompiler';

export interface QuestionCheckCompilerFormProps {
  formCompiler: IUseFormCompiler;
  question: SurveyItem;
}

export function QuestionCheckCompilerForm({
  formCompiler,
  question,
  }: QuestionCheckCompilerFormProps) {
  const form = formCompiler.form;
  const nav = formCompiler.nav;

  const { value, required, handleOnChange, handleOnBlur, error, helperText } = useQuestionHandler(question, formCompiler);

  return (
    <Stack spacing={1}>
      <Stack spacing={1}>
        {/* <FormLabel component="legend">{question.text}</FormLabel> */}
        <FormLabel component="legend">{question.description}</FormLabel>
        {question.layout.style === QuestionCheckMap.layout.style.switch ? (
          <FormControlLabel
           control={
           <Switch 
           checked={value ?? false}
            onChange={(e,c)=>handleOnChange(c)}
            onBlur={handleOnBlur}
           />} 
           label={question.text} 
          />
        ):(
          <FormControlLabel
           control={
           <Checkbox 
           checked={value ?? false}
           onChange={(e,c)=>handleOnChange(c)}
           onBlur={handleOnBlur}
           />} 
           label={question.text} 
          />
        )}
        <FormHelperText>{error && helperText}</FormHelperText>
      </Stack>
    </Stack>
  );
}