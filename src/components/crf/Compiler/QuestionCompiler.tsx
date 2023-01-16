import React from 'react';
import { getQuestionMenuType, GroupMap, QuestionMenuTypesMap, QuestionSelectMap } from '../../../core/schema';
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
}

export function QuestionCompilerForm({
	index,
	item,
	formCompiler,
}: QuestionCompilerFormProps) {
	const form = formCompiler.form;
	const nav = formCompiler.nav;

	// console.log('rendering',item);
	if (item instanceof QuestionText) {
		return (
			<QuestionTextCompilerForm
			index={index}
			formCompiler={formCompiler}
			question={item}
			/>
		);
	} else if (item instanceof QuestionDate) {
		return (
			<QuestionDateCompilerForm
			index={index}
			formCompiler={formCompiler}
			question={item}
			/>
		);
	} else if (item instanceof QuestionNumber) {
		return (
			<QuestionNumberCompilerForm
			index={index}
			formCompiler={formCompiler}
			question={item}
			/>
		);
	} else if (item instanceof QuestionCheck) {
		return (
			<QuestionCheckCompilerForm
			index={index}
			formCompiler={formCompiler}
			question={item}
			/>
			);
	} else if (item instanceof QuestionSelect) {
		return (
			<QuestionSelectCompilerForm
			index={index}
			formCompiler={formCompiler}
			question={item}
			/>
		);
	} else if (item instanceof ItemFunction) {
		return (
			<ItemFunctionCompilerForm
			formCompiler={formCompiler}
			question={item}
			index={index}
			/>
		);
	} else if (item instanceof ItemConditional) {
		return (
			<ItemConditionalCompilerForm
			formCompiler={formCompiler}
			question={item}
			index={index}
			/>
		);
	} else  {
		if (getQuestionMenuType(item) === QuestionMenuTypesMap.selectTable.type) {
				return (
					<QuestionTableCompilerForm
					formCompiler={formCompiler}
					question={item}
					index={index}
					/>
				);
		} else if (getQuestionMenuType(item) === QuestionMenuTypesMap.section.type) {
			return (
				<SectionCompilerForm
				index={index}
				formCompiler={formCompiler}
				question={item}
				/>
			);
		} else if (getQuestionMenuType(item) === QuestionMenuTypesMap.multipleSelect.type) {
				return (<QuestionMultipleSelectCompilerForm
				index={index}
				formCompiler={formCompiler}
				question={item}
			/>);
		}
	}
	return null;
}