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
	return (
			// <SectionCommon
			// 	index={index}
			// 	question={question}
			// 	children={question.items.map((question, idx) => {
			// 		return(
			// 				<QuestionCompilerForm
			// 				key={question.id}
			// 				index={index[question.id]}
			// 				item={question}
			// 				formCompiler={formCompiler}
			// 				/>
			// 		);
			// 	})}
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