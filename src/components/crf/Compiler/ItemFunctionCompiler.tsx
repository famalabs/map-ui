import React from 'react';
import { Button, FormLabel, Stack, Typography } from '@mui/material';
import { ItemFunction, Item } from '../../../survey';
import { AddCircle, Cancel, ExpandMore, Refresh} from '@mui/icons-material';
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
	
	const computed = typeof question.compute() === 'undefined' ? 'undefined' : question.compute();
	console.log("item function",question.params())	
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
				<Typography>{question.text}: {computed}</Typography>
				<Typography>Params: {question.params().toString()}</Typography>
				<Typography>Params: {question.parameters.toString()}</Typography>
				{/* <Typography>Params0: {question.params()[0].getAnswer().toString()}</Typography> */}
				{question.parameters.map((id,idx) => {
					const param = nav.findItemById(id);
					const value = form.getValue(id);
					return (
						<Typography key={id}>{param.text}: {value ? value.toString() : ''}</Typography>
					);
				})}
			</Stack>
		);
}