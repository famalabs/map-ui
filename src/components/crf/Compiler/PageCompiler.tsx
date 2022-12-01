import React from 'react';
import { Divider, Paper, Stack, Typography } from '@mui/material';
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
			<Stack spacing={page.layout.style === GroupMap.layout.style.card ? 6 : 2}>
			<Typography variant='h3'>{page.text}</Typography>
			{page.items.map((question, index) => {
				if (page.layout.style === GroupMap.layout.style.card)  
				{
					return (
						<QuestionCompilerForm
							key={question.id}
							index={index+1}
							item={question}
							formCompiler={formCompiler}
							/>
					);
				}
				return(
					<Paper style={{padding:24}}>
						<QuestionCompilerForm
						key={question.id}
						index={index+1}
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