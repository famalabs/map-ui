import React from 'react';
import {Item} from '../../../survey'
import { QuestionCommonCompilerProps } from './CommonCompiler';
import { QuestionTableCommon } from '../common';
import { useQuestionHandler } from './FormCompiler';

export function QuestionTableCompilerForm({
  formCompiler,
  question,
	index,
  disabled,
  }: QuestionCommonCompilerProps<Item>) {

  const form = formCompiler.form;
  const nav = formCompiler.nav;

  const { value, required, handleOnChange, handleOnBlur, error, helperText } = useQuestionHandler(question, formCompiler);  
  const useQuestionHandlerWrapper = (item:Item) => useQuestionHandler(item, formCompiler);
  return (
    <QuestionTableCommon
    index={index}
    question={question}
    required={false}
    disabled={disabled}
    useQuestionHandler={useQuestionHandlerWrapper}
    value={value}
    handleOnChange={handleOnChange}
    handleOnBlur={handleOnBlur}
    error={error}
    helperText={helperText}
    />
  );
}