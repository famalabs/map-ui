import React from 'react';
import { GroupMap, QuestionSelectMap } from '../../../core/schema';
import { ItemFunction, QuestionCheck, QuestionDate, QuestionNumber, QuestionSelect, QuestionText, Item, Group } from '../../../survey';
import { IUseFormCompiler } from './FormCompiler';
import { QuestionNumberCompilerForm } from './QuestionNumberCompiler';
import { QuestionSelectCompilerForm } from './QuestionSelectCompiler';
import { QuestionTextCompilerForm } from './QuestionTextCompiler';
import { ItemFunctionCompilerForm } from './ItemFunctionCompiler';
import { QuestionCheckCompilerForm } from './QuestionCheckCompiler';
import { QuestionTableCompilerForm } from './QuestionTableCompiler';
import { SectionCompilerForm } from './SectionCompiler';
import { QuestionDateCompilerForm } from './QuestionDateCompiler';

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
	} else if (item.type === Group.TYPE) {
		if (item.layout.style === GroupMap.layout.style.table) {
			if (item.items[0].type === QuestionSelect.TYPE) {
				return (
					<QuestionTableCompilerForm
					formCompiler={formCompiler}
					question={item}
					index={index}
					/>
				);
			}
		} else if (item.layout.style === GroupMap.layout.style.section) {
			return (
				<SectionCompilerForm
				index={index}
				formCompiler={formCompiler}
				question={item}
				/>
			);
		}
	}
	return null;
}