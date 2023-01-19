import React from 'react';
import { Button, Chip, FormLabel, Stack, Typography } from '@mui/material';
import { ItemFunction, Item, Question } from '../../../survey';
import { AddCircle, Cancel, ExpandMore, Refresh} from '@mui/icons-material';
import { IUseFormCompiler, useQuestionHandler } from './FormCompiler';
import { QuestionCommonCompilerProps } from './CommonCompiler';
import { QuestionHeaderCommon } from '../common';
import { getQuestionMenuType, QuestionMenuTypesMap } from '../../../core/schema';

export function ItemFunctionCompilerForm({
  formCompiler,
  question,
	index,
  }: QuestionCommonCompilerProps<ItemFunction>) {

	const form = formCompiler.form;
	const nav = formCompiler.nav;
  
	// const { value, required, handleOnChange, handleOnBlur, error, helperText } = useQuestionHandler(question, formCompiler);
	
	for (let i = 0; i < question.parameters.length; i++) {
		const itm = nav.findItemById(question.parameters[i]);
		if (itm instanceof Question) {
			itm.setAnswer(form.getValue(question.parameters[i]));
		} else {
			
		}
	}

	const computed = typeof question.compute() === 'undefined' ? 'undefined' : question.compute();
	// console.log("item function",question.params())	
	return (
			<Stack>
				<QuestionHeaderCommon
				index={index}
				question={question}
				required={false}
				/>
				<Typography>{question.fn}: {computed}</Typography>
				{/* <Typography>Params: {question.params().toString()}</Typography>
				<Typography>Params: {question.parameters.toString()}</Typography> */}
				{/* <Typography>Params0: {question.params()[0].getAnswer().toString()}</Typography> */}
				<Stack spacing={2} direction={'row'} style={{flexWrap: 'wrap'}}>
				{question.parameters.map((id,idx) => {
					const param = nav.findItemById(id);
					const value = form.getValue(id);
					return (
						<Chip key={id} label={param.text+': ' + JSON.stringify(value) + ''}/>
					);
				})}
				</Stack>
			</Stack>
		);
}