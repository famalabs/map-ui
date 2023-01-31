import React from 'react';
import {Item, QuestionSelect} from '../../../survey'
import { IUseFormCompiler, useQuestionHandler } from './FormCompiler';
import { QuestionMultipleSelectCommon, QuestionSelectCommon } from '../common';
import { QuestionCommonCompilerProps } from './CommonCompiler';

export function QuestionMultipleSelectCompilerForm({
  formCompiler,
  question,
	index,
  disabled,
  }: QuestionCommonCompilerProps<Item>) {

  const { value, required, handleOnChange, handleOnBlur, error, helperText } = useQuestionHandler(question, formCompiler);  
  const useQuestionHandlerWrapper = (item:Item) => useQuestionHandler(item, formCompiler);
  // console.log('render MultipleSelect', questionState);
  return (
    <QuestionMultipleSelectCommon
    index={index}
    question={question}
    required={required}
    disabled={disabled}
    // value={value}
    // handleOnChange={handleOnChange}
    // handleOnBlur={handleOnBlur}
    // error={error}
    // helperText={helperText}
    useQuestionHandler={useQuestionHandlerWrapper}
    />
  );
}