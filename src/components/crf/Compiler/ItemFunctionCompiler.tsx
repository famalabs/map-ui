import React from 'react';
import { Button, Chip, Divider, FormLabel, Stack, TextField, Typography } from '@mui/material';
import { ItemFunction, Item, Question } from '../../../survey';
import { AddCircle, Cancel, ExpandMore, Refresh} from '@mui/icons-material';
import { IUseFormCompiler, useQuestionHandler } from './FormCompiler';
import { QuestionCommonCompilerProps } from './CommonCompiler';
import { ModalCommon, QuestionHeaderCommon } from '../common';
import { getQuestionMenuType, QuestionMenuTypesMap } from '../../forms';
import { QuestionCompilerForm } from './QuestionCompiler';

export function ItemFunctionCompilerForm({
  formCompiler,
  question,
	index,
  disabled,
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
	const [ paramsModal, setParamsModal ] = React.useState<boolean>(false);
	const paramsModalContent = ():JSX.Element => {
		return (
			<>
				<Stack spacing={2}>
				<QuestionHeaderCommon
				index={index}
				question={question}
				required={false}
				/>
				<TextField
					disabled
          variant='outlined'
          label={question.fn}
          value={computed}
        />
				<Divider variant='middle'/>
				</Stack>
			<Stack spacing={2}
			sx={{
				maxHeight: '70vh',
        flexWrap: 'nowrap',
				overflow: 'auto',
			}}
			>
				{question.parameters.map((id,idx) => {
					const param = nav.findItemById(id);
					const value = form.getValue(id);
					// return (
					// 	<Chip key={id} label={param.text+': ' + JSON.stringify(value) + ''}/>
					// );
					return (
						<QuestionCompilerForm
						index={nav.getItemOrderIndex(param.id)}
						item={param}
						formCompiler={formCompiler}	
						// disabled={true}
						/>
					);
				})}
				</Stack>
			</>
		);
	}

	return (
		<>
			<ModalCommon
				open={paramsModal}
				onClose={()=>{setParamsModal(false)}}
				content={paramsModalContent()}
				minWidth={320}			
				/>
			<Stack sx={{
        '&:hover, &.Mui-focusVisible': {
          backgroundColor: 'rgba(61, 90, 128, 0.04)'
        }
      }}
			onClick={(e)=>{setParamsModal(true)}}
			>
				<QuestionHeaderCommon
				index={index}
				question={question}
				required={false}
				/>
				{/* <Typography>{question.fn}: {computed}</Typography> */}
				<TextField
					disabled
          variant='outlined'
          label={question.fn}
          value={computed}
        />
				
				{/* <Stack spacing={2} direction={'row'} style={{flexWrap: 'wrap'}}>
				{question.parameters.map((id,idx) => {
					const param = nav.findItemById(id);
					const value = form.getValue(id);
					return (
						<Chip key={id} label={param.text+': ' + JSON.stringify(value) + ''}/>
					);
				})}
				</Stack> */}
			</Stack>
		</>
		);
}