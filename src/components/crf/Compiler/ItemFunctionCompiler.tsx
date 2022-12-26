import React from 'react';
import { Button, FormLabel, Typography } from '@mui/material';
import { ItemFunction, Item } from '../../../survey';
import RefreshIcon from '@mui/icons-material/Refresh';
import { IUseFormCompiler, useQuestionHandler } from './FormCompiler';


export interface ItemFunctionCompilerProps {
	formCompiler: IUseFormCompiler;
	item: Item;
}

export function ItemFunctionCompilerForm({
	formCompiler,
	item,
}: ItemFunctionCompilerProps) {
	const form = formCompiler.form;
	const nav = formCompiler.nav;
  
	const { value, required, handleOnChange, handleOnBlur, error, helperText } = useQuestionHandler(item, formCompiler);

	if (item instanceof ItemFunction) {

		// const paramValues:any[] = item.parameters.map((id,idx) => form.getValue(item.parameters[idx]))
		// const computedValue = item.compute(paramValues);
		// if (value !== computedValue) {
		// }
		const computedValue = item.compute();
		
		return (
			<div>
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
			</div>
		);
	} 
	return null;
}