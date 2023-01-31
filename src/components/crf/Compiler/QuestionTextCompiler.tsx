import React from 'react';
import {Item, QuestionText } from '../../../survey'
import { IUseFormCompiler, useQuestionHandler } from './FormCompiler';
import { QuestionTextCommon } from '../common';
import { QuestionCommonCompilerProps } from './CommonCompiler';

export function QuestionTextCompilerForm({
  formCompiler,
  question,
	index,
  disabled,
  }: QuestionCommonCompilerProps<QuestionText>) {

  const form = formCompiler.form;
  const nav = formCompiler.nav;

  const { value, required, handleOnChange, handleOnBlur, error, helperText } = useQuestionHandler(question, formCompiler);

  // console.log('render number', questionState);
  return (
    <QuestionTextCommon
    index={index}
    question={question}
    required={required}
    disabled={disabled}
    value={value}
    handleOnChange={handleOnChange}
    handleOnBlur={handleOnBlur}
    error={error}
    helperText={helperText}
    />
  );
}