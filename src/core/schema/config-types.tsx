import { TextFields, Functions, Pin, RadioButtonChecked, ToggleOnOutlined, TocRounded, CheckBox, CalendarMonth, WebAsset, LinearScaleRounded, ArrowDropDownCircleOutlined, AccountTree, List, LibraryAddCheck } from '@mui/icons-material';
import React from "react";
import { QuestionTextMap, QuestionNumberMap, QuestionSelectMap, QuestionCheckMap, QuestionDateMap, GroupMap, FnMap } from './config-map';
import { Item, Question, QuestionText, QuestionNumber, QuestionSelect, QuestionDate, QuestionCheck, ItemFunction, ItemConditional } from '../../survey'
import { QuestionList } from '../../survey/src/lib/form/question-list';

export interface QuestionMenuType {
	[id:string]: {
		type: string;
		icon: JSX.Element;
		locale: {
			it: string;
			en: string;
		}
	}
}

export const QuestionMenuTypesMap = {
	text: {
		type: 'text',
		icon: <TextFields/>,
		locale: {
			it: 'Testo',
			en: 'Text',
		}
	},
	textMulti: {
		type: 'textMulti',
		icon: <TextFields/>,
		locale: {
			it: 'Testo Multiriga',
			en: 'Text Multiline',
		}
	},
	number: {
		type: 'number',
		icon: <Pin/>,
		locale: {
			it: 'Numero',
			en: 'Number',
		}
	},
	range: {
		type: 'range',
		icon: <LinearScaleRounded/>,
		locale: {
			it: 'Intervallo',
			en: 'Range',
		}
	},
	select: {
		type: 'select',
		icon: <RadioButtonChecked/>,
		locale: {
			it: 'Selezione',
			en: 'Select',
		}
	},
	dropdown: {
		type: 'dropdown',
		icon: <ArrowDropDownCircleOutlined/>,
		locale: {
			it: 'Selezione a Tendina',
			en: 'Dropdown',
		}
	},
	multipleSelect: {
		type: 'multipleSelect',
		icon: <LibraryAddCheck/>,
		locale: {
			it: 'Selezione multipla',
			en: 'Multiple select',
		}
	},
	selectTable: {
		type: 'selectTable',
		icon: <TocRounded/>,
		locale: {
			it: 'Tavolo di Selezione',
			en: 'Select Table',
		}
	},
	check: {
		type: 'check',
		icon: <CheckBox/>,
		locale: {
			it: 'Casella di Spunta',
			en: 'Checkbox',
		}
	},
	switch: {
		type: 'switch',
		icon: <ToggleOnOutlined/>,
		locale: {
			it: 'Interruttore',
			en: 'Switch',
		}
	},
	date: {
		type: 'date',
		icon: <CalendarMonth/>,
		locale: {
			it: 'Data',
			en: 'Date',
		}
	},
	section: {
		type: 'section',
		icon: <WebAsset/>,
		locale: {
			it: 'Sezione',
			en: 'Section',
		},
	},
	// list: {
	// 	type: 'list',
	// 	icon: <List/>,
	// 	locale: {
	// 		it: 'Lista',
	// 		en: 'List',
	// 	}
	// },
	fn: {
		type: 'fn',
		icon: <Functions/>,
		locale: {
			it: 'Funzione',
			en: 'Function',
		}
	},
	cond: {
		type: 'cond',
		icon: <AccountTree/>,
		locale: {
			it: 'Condizione',
			en: 'Condition',
		}
	}
	
} as QuestionMenuType;

export const getQuestionMenuType = (question:Item):string => {
	if (question.type === QuestionText.TYPE) {
		return QuestionMenuTypesMap.text.type;
	} else if (question.type === QuestionNumber.TYPE) {
		if (question.layout.style === QuestionNumberMap.layout.style.range) {
			return QuestionMenuTypesMap.range.type;
		}
		return QuestionMenuTypesMap.number.type;
	} else if (question.type === QuestionSelect.TYPE) {
		if (question.layout.style === QuestionSelectMap.layout.style.dropdown) {
			return QuestionMenuTypesMap.dropdown.type;
		}
		return QuestionMenuTypesMap.select.type;
	} else if (question.type === QuestionCheck.TYPE) {
		if (question.layout.style === QuestionCheckMap.layout.style.switch) {
			return QuestionMenuTypesMap.switch.type;
		}
		return QuestionMenuTypesMap.check.type;
	} else if (question.type === QuestionDate.TYPE) {
		return QuestionMenuTypesMap.date.type;
	// } else if (question.type === QuestionList.TYPE) {
	// 	return QuestionMenuTypesMap.list.type;
	} else if (question.type === ItemFunction.TYPE) {
		return QuestionMenuTypesMap.fn.type;
	} else if (question.type === ItemConditional.TYPE) { 
		return QuestionMenuTypesMap.cond.type;
	} else if (question.type === Item.TYPE) {
		if (question.layout.style === GroupMap.layout.style.table) {
			if (question.items[0].type === QuestionSelect.TYPE) {
				return QuestionMenuTypesMap.selectTable.type;
			}
		} else if (question.layout.style === GroupMap.layout.style.section) {
			return QuestionMenuTypesMap.section.type;
		} else  {
			if (question.items[0].type === QuestionCheck.TYPE) {
				return QuestionMenuTypesMap.multipleSelect.type;
			}
		}
	} 
	return null;
}