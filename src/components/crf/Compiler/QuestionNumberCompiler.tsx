import React from 'react';
import {QuestionNumber} from '../../../survey'
import { useQuestionHandler } from './FormCompiler';
import { QuestionCommonCompilerProps } from './CommonCompiler';
import { QuestionNumberCommon } from '../common';

export function QuestionNumberCompilerForm({
  formCompiler,
  question,
	index,
  }: QuestionCommonCompilerProps<QuestionNumber>) {

  const form = formCompiler.form;
  const nav = formCompiler.nav;

  const { value, required, handleOnChange, handleOnBlur, error, helperText } = useQuestionHandler(question, formCompiler);

  // console.log('render number', questionState);
  return (
    <QuestionNumberCommon
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