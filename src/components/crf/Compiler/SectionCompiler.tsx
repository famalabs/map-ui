import React from 'react';
import { Divider, Paper, Stack, Typography } from '@mui/material';
import { QuestionCompilerForm } from './QuestionCompiler';
import { Item } from '../../../survey';

import { QuestionCommonCompilerProps } from './CommonCompiler';
import { SectionCommon } from '../common';

export function SectionCompilerForm({
  formCompiler,
  question,
	index,
  }: QuestionCommonCompilerProps<Item>) {

	const form = formCompiler.form;
	const nav = formCompiler.nav;

	// const content = (<div>{question.items.map((question, idx) => {
	// 	return(
	// 			<QuestionCompilerForm
	// 			key={question.id}
	// 			index={index[question.id]}
	// 			item={question}
	// 			formCompiler={formCompiler}
	// 			/>
	// 	);
	// })}</div>)
	return (
			// <SectionCommon
			// 	index={index}
			// 	question={question}
			// 	content={content}
			// />
			<Stack spacing={6}>
			<Stack>
			<Typography variant='h4'>{question.text}</Typography>
			<Typography>{question.description}</Typography>
			</Stack>
			{question.items.map((question, idx) => {
				return(
						<QuestionCompilerForm
						key={question.id}
						index={index[question.id]}
						item={question}
						formCompiler={formCompiler}
						/>
				);
			})}
			</Stack>
	);
}