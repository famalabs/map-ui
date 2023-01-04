import React from 'react';
import {Item} from '../../../survey'
import { QuestionCommonCompilerProps } from './CommonCompiler';
import { QuestionTableCommon } from '../common';

export function QuestionTableCompilerForm({
  formCompiler,
  question,
	index,
  }: QuestionCommonCompilerProps<Item>) {

  const form = formCompiler.form;
  const nav = formCompiler.nav;

  return (
    <QuestionTableCommon
    index={index}
    question={question}
    required={false}
    disabled={false}
    formCompiler={formCompiler}
    // value={value}
    // handleOnChange={handleOnChange}
    // handleOnBlur={handleOnBlur}
    // error={error}
    // helperText={helperText}
    />
  );
}