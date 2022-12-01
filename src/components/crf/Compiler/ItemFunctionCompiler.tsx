import React from 'react';
import { Button, FormLabel, Typography } from '@mui/material';
import { AdapterUseFormStateSurvey, ItemFunction, SurveyItem } from '../../../core/schema';
import RefreshIcon from '@mui/icons-material/Refresh';
import { IUseFormCompiler, useQuestionHandler } from './FormCompiler';


export interface ItemFunctionCompilerProps {
	formCompiler: IUseFormCompiler;
	item: SurveyItem;
}

export function ItemFunctionCompilerForm({
	formCompiler,
	item,
}: ItemFunctionCompilerProps) {
	const form = formCompiler.form;
	const nav = formCompiler.nav;
  
	const { value, required, handleOnChange, handleOnBlur, error, helperText } = useQuestionHandler(item, formCompiler);

	if (item instanceof ItemFunction) {

		const paramValues:any[] = item.parameters.map((id,idx) => form.getValue(item.parameters[idx]))
		// const computeValue = (res) => form.getSetValue(item.id)(res);
		const computedValue = item.computeWithValues(paramValues);
		if (value !== computedValue) {
			// handleOnChange(computedValue);
			// computeValue(computedValue);
		}
		
		// const computeValue = (res) => form.getSetValue(item.id)(res);
		// const computeFnValue = () => {
		//     console.log(item.toUseFormState());
		//     if (item.hasValidParams()) computeValue(item.compute());
		// };
		return (
			<div>
				{/* {item.text === '' ? null : <FormLabel component="legend">{item.text ?? item.id}</FormLabel>}
				<Button color="inherit" onClick={(e) => {computeFnValue();}}>
					Calcola {item.text}
				</Button>
				<Typography>{value.toString()}</Typography> */}
				<Typography>{item.text}: {value ? value.toString() : ''}</Typography>
				<Button color="primary" variant="contained" onClick={(e) => {handleOnChange(computedValue);}}>
					<RefreshIcon/>
				</Button>
				{item.parameters.map((id,idx) => {
					const param = nav.findItemById(id);
					const value = form.getValue(id);
					return (
						<Typography>{param.text}: {value ? value.toString() : ''}</Typography>
					);
				})}
				{/* <Typography>Parameters: {item.parameters.map((id) => id+",")}</Typography>
				<Typography>Params values: {item.parameters.map((id) => item.getParam(id))}</Typography>
				<Typography>Params values: {item.parameters.map((id,idx) => form.getValue(item.parameters[idx]))}</Typography>
				<Typography>Value: {item.computeWithValues(paramValues)}</Typography>
				<Typography>Value: {value.toString()}</Typography> */}
			</div>
		);
	} 
	return null;
}