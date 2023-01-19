import React from 'react';
import { Divider, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { QuestionCompilerForm } from './QuestionCompiler';
import { GroupMap } from '../../../core/schema';
import { IUseFormCompiler } from './FormCompiler';

export interface PageCompilerFormProps {
  formCompiler:IUseFormCompiler;
	loading: boolean;
}

export function PageCompilerForm ({
  formCompiler,
	loading,
}:PageCompilerFormProps) {

	const form = formCompiler.form;
	const nav = formCompiler.nav;
	const page = nav.getPage();
	const orders = nav.getItemsGroupedOrderIndex()[nav.getFolderId()][page.id];

	const ready = (
		<div>
			<Stack spacing={page.layout.style === GroupMap.layout.style.card ? 6 : 2}>
			<Typography variant='h4'>{page.text}</Typography>
			{page.items.map((question, index) => {
				if (page.layout.style === GroupMap.layout.style.card)  
				{
					return (
						<QuestionCompilerForm
							key={question.id}
							index={orders}
							item={question}
							formCompiler={formCompiler}
							/>
					);
				}
				return(
					<Paper style={{padding:24}}>
						<QuestionCompilerForm
						key={question.id}
						index={orders}
						item={question}
						formCompiler={formCompiler}
						/>
					</Paper>
				);
			})}
			</Stack>
		</div>
	);

	const skeleton = (

		<Stack spacing={2}>
		<Skeleton animation="wave" variant="text" sx={{ fontSize: '5rem' }} />

		<Stack spacing={0}>
		<Skeleton animation="wave" variant="text" sx={{ fontSize: '2rem' }} />
		{/* <Skeleton animation="wave" variant="text" sx={{ fontSize: '3rem' }} /> */}
		<Skeleton animation="wave" variant="text" sx={{ fontSize: '5rem' }} />
		</Stack>


		<Stack spacing={0}>
		<Skeleton animation="wave" variant="text" sx={{ fontSize: '2rem' }} />
		{/* <Skeleton animation="wave" variant="text" sx={{ fontSize: '3rem' }} /> */}
		<Stack spacing={0} sx={{pl:8}}>
		<Skeleton animation="wave" variant="text" sx={{ fontSize: '2rem' }} />
		<Skeleton animation="wave" variant="text" sx={{ fontSize: '2rem' }} />
		<Skeleton animation="wave" variant="text" sx={{ fontSize: '2rem' }} />
		</Stack>
		</Stack>

		<Stack spacing={0}>
		<Skeleton animation="wave" variant="text" sx={{ fontSize: '2rem' }} />
		{/* <Skeleton animation="wave" variant="text" sx={{ fontSize: '3rem' }} /> */}
		<Skeleton animation="wave" variant="text" sx={{ fontSize: '5rem' }} />
		</Stack>

		</Stack>
	);
	
	return loading ? skeleton : ready;

}