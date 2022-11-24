import React from 'react';
import { Button, FormLabel, Typography } from '@mui/material';
import { GroupMap, ItemFunction, Question, QuestionCheck, QuestionDate, QuestionNumber, QuestionNumberMap, QuestionSelect, QuestionSelectMap, QuestionText, SurveyItem } from '../../../core/schema';
import { InputDate, InputNumber, InputRadio, InputString } from '../../forms';
import { IUseFormCompiler } from './FormCompiler';

export interface QuestionCompilerFormProps {
	item: SurveyItem;
	formCompiler: IUseFormCompiler;
}

export function QuestionCompilerForm({
	item,
	formCompiler,
}: QuestionCompilerFormProps) {
	const form = formCompiler.form;
	const nav = formCompiler.nav;

	if (item instanceof QuestionText) {
		return (
			<InputString
			nameid={item.id}
			title={item.text}
			label={item.description ?? item.text}
			value={form.getValue(item.id)}
			setValue={(text) => form.setValue(item.id)(text)}
			required={form.getRequired(item.id)}
			// required={item.options.required}
			// emptyMessage={'empty message'}
			showError={form.getShowError(item.id)}
			/>
		);
	} else if (item instanceof QuestionDate) {
		return (
			<InputDate
				nameid={item.id}
				title={item.text}
				label={item.description ?? item.text}
				value={form.getValue(item.id)}
				setValue={(text) => form.setValue(item.id)(text)}
				required={form.getRequired(item.id)}
				// required={item.options.required}
				// emptyMessage={'empty message'}
				showError={form.getShowError(item.id)}
			/>
		);
	} else if (item instanceof QuestionNumber) {
		if (item.layout.style === QuestionNumberMap.layout.style.default) {
			return null;
		}
		return (
			<InputNumber
			nameid={item.id}
			title={item.text}
			label={item.description ?? item.text}
			value={form.getValue(item.id)}
			setValue={(number) => form.setValue(item.id)(number)}
			required={form.getRequired(item.id)}
			// required={item.options.required}
			// emptyMessage={'empty message'}
			showError={form.getShowError(item.id)}
			/>
		);
	} else if (item instanceof QuestionCheck) {
		return null;
	} else if (item instanceof QuestionSelect) {
		return (
			<InputRadio
				nameid={item.id}
				title={item.text}
				value={form.getValue(item.id)}
				options={item.textScoreToOption() as any}
				setValue={(radio) => form.setValue(item.id)(radio)}
				required={form.getRequired(item.id)}
				// required={item.options.required}
				// emptyMessage={'empty message'}
				showError={form.getShowError(item.id)}
			/>
		);
	} else if (item instanceof ItemFunction) {
		return null;
	} else if (item.type === GroupMap.type) {
		if (item.layout.style === GroupMap.layout.style.table) {
			if (item.items[0].type === QuestionSelectMap.type) {
				return null;
			}
		}
	}
	return null;
}