import React from 'react';
import {QuestionDate} from '../../../survey'
import { useQuestionHandler } from './FormCompiler';
// import * as dayjs from 'dayjs'
// import 'dayjs/locale/it';
// import 'dayjs/locale/en';
import { QuestionCommonCompilerProps } from './CommonCompiler';
import { QuestionDateCommon } from '../common';

export function QuestionDateCompilerForm({
  formCompiler,
  question,
	index,
  }: QuestionCommonCompilerProps<QuestionDate>) {

  const form = formCompiler.form;
  const nav = formCompiler.nav;

  const { value, required, handleOnChange, handleOnBlur, error, helperText } = useQuestionHandler(question, formCompiler);

  // console.log('render number', questionState);
  return (
    <QuestionDateCommon
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