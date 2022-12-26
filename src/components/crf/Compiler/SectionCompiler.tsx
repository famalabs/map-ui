import React from 'react';
import { Divider, Paper, Stack, Typography } from '@mui/material';
import { QuestionCompilerForm } from './QuestionCompiler';
import { Item } from '../../../survey';
import { IUseFormCompiler } from './FormCompiler';

export interface SectionCompilerFormProps {
	index?: any;
	section: Item;
	formCompiler: IUseFormCompiler;
}

export function SectionCompilerForm ({
	index,
	section,
	formCompiler,
}:SectionCompilerFormProps) {
	const form = formCompiler.form;
	const nav = formCompiler.nav;
	return (
			<Stack spacing={6}>
        <Stack>
			<Typography variant='h4'>{section.text}</Typography>
			<Typography>{section.description}</Typography>
        </Stack>
			{section.items.map((question, idx) => {
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