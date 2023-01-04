import React from 'react';
import {QuestionCheckMap} from '../../../core/schema'
import {Item, QuestionCheck} from '../../../survey'
import { FormLabel, Stack, Switch, Checkbox, FormControlLabel, FormHelperText } from '@mui/material';
import { IUseFormCompiler, useQuestionHandler } from './FormCompiler';
import { QuestionCommonCompilerProps } from './CommonCompiler';
import { QuestionCheckCommon } from '../common';

export function QuestionCheckCompilerForm({
  formCompiler,
  question,
	index,
  }: QuestionCommonCompilerProps<QuestionCheck>) {
    
  const form = formCompiler.form;
  const nav = formCompiler.nav;

  const { value, required, handleOnChange, handleOnBlur, error, helperText } = useQuestionHandler(question, formCompiler);

  return (
    <QuestionCheckCommon
    index={index}
    question={question}
    required={required}
    disabled={false}
    value={value}
    handleOnChange={handleOnChange}
    handleOnBlur={handleOnBlur}
    error={error}
    helperText={helperText}
    />
  );
}