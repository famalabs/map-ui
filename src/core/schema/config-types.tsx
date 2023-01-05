import { TextFields, Functions, Pin, RadioButtonChecked, ToggleOnOutlined, TocRounded, CheckBox, CalendarMonth, WebAsset, LinearScaleRounded, ArrowDropDownCircleOutlined } from '@mui/icons-material';
import React from "react";
import { QuestionTextMap, QuestionNumberMap, QuestionSelectMap, QuestionCheckMap, QuestionDateMap, GroupMap, FnMap } from './config-map';
import { SurveyItem } from './survey-item';
import { Item, Question, QuestionText, QuestionNumber, QuestionSelect, QuestionDate, QuestionCheck, ItemFunction } from '../../survey'

export const QuestionMenuTypesMap = {
	text: {
		'type': 'text',
		'icon': <TextFields/>,
		'locale': {
			'it': 'Testo',
			'en': 'Text',
		}
	},
	textMulti: {
		'type': 'textMulti',
		'icon': <TextFields/>,
		'locale': {
			'it': 'Testo Multiriga',
			'en': 'Text Multiline',
		}
	},
	number: {
		'type': 'number',
		'icon': <Pin/>,
		'locale': {
			'it': 'Numero',
			'en': 'Number',
		}
	},
	range: {
		'type': 'range',
		'icon': <LinearScaleRounded/>,
		'locale': {
			'it': 'Intervallo',
			'en': 'Range',
		}
	},
	select: {
		'type': 'select',
		'icon': <RadioButtonChecked/>,
		'locale': {
			'it': 'Selezione',
			'en': 'Select',
		}
	},
	dropdown: {
		'type': 'dropdown',
		'icon': <ArrowDropDownCircleOutlined/>,
		'locale': {
			'it': 'Selezione a Tendina',
			'en': 'Dropdown',
		}
	},
	selectTable: {
		'type': 'selectTable',
		'icon': <TocRounded/>,
		'locale': {
			'it': 'Tavolo di Selezione',
			'en': 'Select Table',
		}
	},
	check: {
		'type': 'check',
		'icon': <CheckBox/>,
		'locale': {
			'it': 'Casella di Spunta',
			'en': 'Checkbox',
		}
	},
	switch: {
		'type': 'switch',
		'icon': <ToggleOnOutlined/>,
		'locale': {
			'it': 'Interruttore',
			'en': 'Switch',
		}
	},
	date: {
		'type': 'date',
		'icon': <CalendarMonth/>,
		'locale': {
			'it': 'Data',
			'en': 'Date',
		}
	},
	fn: {
		'type': 'fn',
		'icon': <Functions/>,
		'locale': {
			'it': 'Funzione',
			'en': 'Function',
		}
	},
	section: {
		'type': 'section',
		'icon': <WebAsset/>,
		'locale': {
			'it': 'Sezione',
			'en': 'Section',
		},
	}
}

export const getOldQuestionMenuType = (question:SurveyItem):string => {
		if (question.type === QuestionTextMap.type) {
      return QuestionMenuTypesMap.text.type;
    } else if (question.type === QuestionNumberMap.type) {
      if (question.layout.style === QuestionNumberMap.layout.style.range) {
        return QuestionMenuTypesMap.range.type;
      }
      return QuestionMenuTypesMap.number.type;
    } else if (question.type === QuestionSelectMap.type) {
      if (question.layout.style === QuestionSelectMap.layout.style.dropdown) {
        return QuestionMenuTypesMap.dropdown.type;
      }
      return QuestionMenuTypesMap.select.type;
    } else if (question.type === QuestionCheckMap.type) {
			if (question.layout.style === QuestionCheckMap.layout.style.switch) {
				return QuestionMenuTypesMap.switch.type;
			}
      return QuestionMenuTypesMap.check.type;
    } else if (question.type === QuestionDateMap.type) {
      return QuestionMenuTypesMap.date.type;
    } else if (question.type === GroupMap.type) {
      if (question.layout.style === GroupMap.layout.style.table) {
        if (question.items[0].type === QuestionSelectMap.type) {
          return QuestionMenuTypesMap.selectTable.type;
        }
      } else if (question.layout.style === GroupMap.layout.style.section) {
				return QuestionMenuTypesMap.section.type;
			}
    } else if (question.type === FnMap.type) {
			return QuestionMenuTypesMap.fn.type;
		}
		return null;
}

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
	} else if (question.type === Item.TYPE) {
		if (question.layout.style === GroupMap.layout.style.table) {
			if (question.items[0].type === QuestionSelect.TYPE) {
				return QuestionMenuTypesMap.selectTable.type;
			}
		} else if (question.layout.style === GroupMap.layout.style.section) {
			return QuestionMenuTypesMap.section.type;
		}
	} else if (question.type === ItemFunction.TYPE) {
		return QuestionMenuTypesMap.fn.type;
	}
	return null;
}