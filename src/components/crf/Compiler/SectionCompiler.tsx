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

	const renderContent = () => (
		<>
		{question.items.map((qs, idx) => {
				return(
						<QuestionCompilerForm
						key={qs.id}
						index={index}
						item={qs}
						formCompiler={formCompiler}
						/>
				);
			})}
		</>
	)
	return (
			<SectionCommon
			index={index}
			question={question}
			content={renderContent()}
			handleMouseEnter={undefined}
			handleClick={undefined}			
			/>
			// <Stack spacing={6}>
			// <Stack>
			// <Typography variant='h5'>{index[question.id]}{question.text}</Typography>
			// <Typography>{question.description}</Typography>
			// </Stack>
			// {question.items.map((qs, idx) => {
			// 	return(
			// 			<QuestionCompilerForm
			// 			key={qs.id}
			// 			index={index}
			// 			item={qs}
			// 			formCompiler={formCompiler}
			// 			/>
			// 	);
			// })}
			// </Stack>
	);
}