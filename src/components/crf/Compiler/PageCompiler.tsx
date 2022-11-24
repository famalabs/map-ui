import React from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import { QuestionCompilerForm } from './QuestionCompiler';
import { GroupMap } from '../../../core/schema';
import { IUseFormCompiler } from './FormCompiler';

export interface PageCompilerFormProps {
  formCompiler:IUseFormCompiler;
}

export function PageCompilerForm ({
  formCompiler,
}:PageCompilerFormProps) {
	const form = formCompiler.form;
	const nav = formCompiler.nav;
	const page = nav.getPage();
	return (
		<div>
			<Stack spacing={2}>
			<Typography variant='h3'>{page.text}</Typography>
			{page.items.map((question) => {
				// console.log('before render qs', question.id, questionState, questionState[question.id]);
				if (page.layout.style === GroupMap.layout.style.card)  
				{
					return (
					<QuestionCompilerForm
					key={question.id}
					item={question}
					formCompiler={formCompiler}
					/>
					);
				}
				return(
					<Paper style={{padding:24}}>
						<QuestionCompilerForm
						key={question.id}
						item={question}
						formCompiler={formCompiler}
						/>
					</Paper>
				);
			})}
			</Stack>
		</div>
	);
}