import React from 'react';
import { Divider, Paper, Stack, Typography } from '@mui/material';
import { QuestionCompilerForm } from './QuestionCompiler';
import { Item, ItemConditional, Question } from '../../../survey';

import { QuestionCommonCompilerProps } from './CommonCompiler';
import { SectionCommon } from '../common';
import { Identifier } from '../../../survey/src/lib/form/ast';

export function ItemConditionalCompilerForm({
  formCompiler,
  question,
	index,
  }: QuestionCommonCompilerProps<ItemConditional>) {

	const form = formCompiler.form;
	const nav = formCompiler.nav;

  const leftId = (question.expression.left as Identifier).name
  question.parameters = [leftId];
  const left = nav.findItemById(leftId) as Question;
  left.setAnswer(form.getValue(leftId));
  const isActive = question.compute();

	return (
			<Stack spacing={1}>
      {/* <Typography>score: {JSON.stringify(left.getScore())}</Typography>
      <Typography>value: {JSON.stringify(form.getValue(leftId))}</Typography>
      <Typography>expr: {JSON.stringify(question.expression)}</Typography>
      <Typography>active: {JSON.stringify(isActive)}</Typography> */}
			{isActive && question.items.map((question, idx) => {
				return(
						<QuestionCompilerForm
						key={question.id}
						index={null}
						// index={index[question.id]}
						item={question}
						formCompiler={formCompiler}
						/>
				);
			})}
			</Stack>
	);
}