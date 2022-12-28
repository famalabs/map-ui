import React from 'react';
import { Button, FormLabel, Stack, Typography } from '@mui/material';
import { ItemFunction, Item } from '../../../survey';
import RefreshIcon from '@mui/icons-material/Refresh';
import { IUseFormCompiler, useQuestionHandler } from './FormCompiler';
import { QuestionCommonCompilerProps } from './CommonCompiler';
import { QuestionHeaderCommon } from '../common';

export function ItemFunctionCompilerForm({
  formCompiler,
  question,
	index,
  }: QuestionCommonCompilerProps<ItemFunction>) {

	const form = formCompiler.form;
	const nav = formCompiler.nav;
  
	const { value, required, handleOnChange, handleOnBlur, error, helperText } = useQuestionHandler(question, formCompiler);
		
		return (
			<Stack>
				<QuestionHeaderCommon
				index={index}
				question={question}
				required={false}
				/>
				{/* <Button color="primary" variant="contained" onClick={(e) => {handleOnChange(computedValue);}}>
					<RefreshIcon/>
				</Button> */}
				{/* <Typography>{`${question.fnCompute().name}: ${question.compute()}`}</Typography> */}
				{question.parameters.map((id,idx) => {
					const param = nav.findItemById(id);
					const value = form.getValue(id);
					return (
						<Typography>{param.text}: {value ? value.toString() : ''}</Typography>
					);
				})}
			</Stack>
		);
}