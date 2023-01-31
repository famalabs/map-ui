import React from 'react';
import {QuestionSelect} from '../../../survey'
import { IUseFormCompiler, useQuestionHandler } from './FormCompiler';
import { QuestionSelectCommon } from '../common';
import { QuestionCommonCompilerProps } from './CommonCompiler';

export function QuestionSelectCompilerForm({
  formCompiler,
  question,
	index,
  disabled,
  }: QuestionCommonCompilerProps<QuestionSelect>) {

  const { value, required, handleOnChange, handleOnBlur, error, helperText } = useQuestionHandler(question, formCompiler);

  // console.log('render Select', questionState);
  return (
    <QuestionSelectCommon
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