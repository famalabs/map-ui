import TextFieldsIcon from '@mui/icons-material/TextFields';
import FunctionsIcon from '@mui/icons-material/Functions';
import PinIcon from '@mui/icons-material/Pin';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined';
import TocRoundedIcon from '@mui/icons-material/TocRounded';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LinearScaleRoundedIcon from '@mui/icons-material/LinearScaleRounded';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import React from "react";
import { QuestionTextMap, QuestionNumberMap, QuestionSelectMap, QuestionCheckMap, QuestionDateMap, GroupMap, FnMap } from './config-map';
import { SurveyItem } from './survey-item';

export const QuestionMenuTypesMap = {
	text: {
		'type': 'text',
		'icon': <TextFieldsIcon/>,
		'locale': {
			'it': 'Testo',
			'en': 'Text',
		}
	},
	textMulti: {
		'type': 'textMulti',
		'icon': <TextFieldsIcon/>,
		'locale': {
			'it': 'Testo Multiriga',
			'en': 'Text Multiline',
		}
	},
	number: {
		'type': 'number',
		'icon': <PinIcon/>,
		'locale': {
			'it': 'Numero',
			'en': 'Number',
		}
	},
	range: {
		'type': 'range',
		'icon': <LinearScaleRoundedIcon/>,
		'locale': {
			'it': 'Intervallo',
			'en': 'Range',
		}
	},
	select: {
		'type': 'select',
		'icon': <RadioButtonCheckedIcon/>,
		'locale': {
			'it': 'Selezione',
			'en': 'Select',
		}
	},
	dropdown: {
		'type': 'dropdown',
		'icon': <ArrowDropDownCircleOutlinedIcon/>,
		'locale': {
			'it': 'Selezione a Tendina',
			'en': 'Dropdown',
		}
	},
	selectTable: {
		'type': 'selectTable',
		'icon': <TocRoundedIcon/>,
		'locale': {
			'it': 'Tavolo di Selezione',
			'en': 'Select Table',
		}
	},
	check: {
		'type': 'check',
		'icon': <CheckBoxIcon/>,
		'locale': {
			'it': 'Casella di Spunta',
			'en': 'Checkbox',
		}
	},
	switch: {
		'type': 'switch',
		'icon': <ToggleOnOutlinedIcon/>,
		'locale': {
			'it': 'Interruttore',
			'en': 'Switch',
		}
	},
	date: {
		'type': 'date',
		'icon': <CalendarMonthIcon/>,
		'locale': {
			'it': 'Data',
			'en': 'Date',
		}
	},
	fn: {
		'type': 'fn',
		'icon': <FunctionsIcon/>,
		'locale': {
			'it': 'Funzione',
			'en': 'Function',
		}
	},
}

export const getQuestionMenuType = (question:SurveyItem):string => {
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
      }
    } else if (question.type === FnMap.type) {
			return QuestionMenuTypesMap.fn.type;
		}
		return null;
}