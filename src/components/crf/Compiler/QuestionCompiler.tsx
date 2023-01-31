import React from 'react';
import { getQuestionMenuType, GroupMap, QuestionMenuTypesMap, QuestionSelectMap } from '../../forms';
import { ItemFunction, QuestionCheck, QuestionDate, QuestionNumber, QuestionSelect, QuestionText, Item, ItemConditional } from '../../../survey';
import { IUseFormCompiler } from './FormCompiler';
import { QuestionNumberCompilerForm } from './QuestionNumberCompiler';
import { QuestionSelectCompilerForm } from './QuestionSelectCompiler';
import { QuestionTextCompilerForm } from './QuestionTextCompiler';
import { ItemFunctionCompilerForm } from './ItemFunctionCompiler';
import { QuestionCheckCompilerForm } from './QuestionCheckCompiler';
import { QuestionTableCompilerForm } from './QuestionTableCompiler';
import { SectionCompilerForm } from './SectionCompiler';
import { QuestionDateCompilerForm } from './QuestionDateCompiler';
import { ItemConditionalCompilerForm } from './ItemConditionalCompiler';
import { QuestionMultipleSelectCompilerForm } from './QuestionMultipleSelectCompiler';

export interface QuestionCompilerFormProps {
	index?: any;
	item: Item;
	formCompiler: IUseFormCompiler;
	disabled?:boolean;
}

export function QuestionCompilerForm({
	index,
	item,
	formCompiler,
	disabled=false,
}: QuestionCompilerFormProps) {
	const form = formCompiler.form;
	const nav = formCompiler.nav;

	// const thisIndex = index[item.id];
	const thisIndex = nav.getItemOrderIndex(item.id);

	// console.log('rendering',item);
	if (item instanceof QuestionText) {
		return (
			<QuestionTextCompilerForm
			index={thisIndex}
			formCompiler={formCompiler}
			question={item}
			disabled={disabled}
			/>
		);
	} else if (item instanceof QuestionDate) {
		return (
			<QuestionDateCompilerForm
			index={thisIndex}
			formCompiler={formCompiler}
			question={item}
			disabled={disabled}
			/>
		);
	} else if (item instanceof QuestionNumber) {
		return (
			<QuestionNumberCompilerForm
			index={thisIndex}
			formCompiler={formCompiler}
			question={item}
			disabled={disabled}
			/>
		);
	} else if (item instanceof QuestionCheck) {
		return (
			<QuestionCheckCompilerForm
			index={thisIndex}
			formCompiler={formCompiler}
			question={item}
			disabled={disabled}
			/>
			);
	} else if (item instanceof QuestionSelect) {
		return (
			<QuestionSelectCompilerForm
			index={thisIndex}
			formCompiler={formCompiler}
			question={item}
			disabled={disabled}
			/>
		);
	} else if (item instanceof ItemFunction) {
		return (
			<ItemFunctionCompilerForm
			formCompiler={formCompiler}
			question={item}
			index={thisIndex}
			disabled={disabled}
			/>
		);
	} else if (item instanceof ItemConditional) {
		return (
			<ItemConditionalCompilerForm
			formCompiler={formCompiler}
			question={item}
			index={thisIndex}
			disabled={disabled}
			/>
		);
	} else  {
		if (getQuestionMenuType(item) === QuestionMenuTypesMap.selectTable.type) {
				return (
					<QuestionTableCompilerForm
					formCompiler={formCompiler}
					question={item}
					index={thisIndex}
					disabled={disabled}
					/>
				);
		} else if (getQuestionMenuType(item) === QuestionMenuTypesMap.section.type) {
			return (
				<SectionCompilerForm
				index={thisIndex}
				formCompiler={formCompiler}
				question={item}
				disabled={disabled}
				/>
			);
		} else if (getQuestionMenuType(item) === QuestionMenuTypesMap.multipleSelect.type) {
				return (<QuestionMultipleSelectCompilerForm
				index={thisIndex}
				formCompiler={formCompiler}
				question={item}
				disabled={disabled}
			/>);
		}
	}
	return null;
}