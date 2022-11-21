import React from 'react';
import {Survey, GroupMap, Question, QuestionMap, QuestionTextMap, QuestionNumberMap, QuestionSelectMap, QuestionCheckMap, QuestionDateMap, FnMap, SurveyItem} from '../../../core/schema'
import { AutoSelect } from '../../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid, Typography, InputLabel, Select, MenuItem, FormLabel, Accordion, AccordionSummary, AccordionDetails, Menu, Stack, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import FunctionsIcon from '@mui/icons-material/Functions';
import PinIcon from '@mui/icons-material/Pin';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import TocIcon from '@mui/icons-material/Toc';
import TocRoundedIcon from '@mui/icons-material/TocRounded';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LinearScaleRoundedIcon from '@mui/icons-material/LinearScaleRounded';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import { QuestionEditorForm } from './QuestionEditor';
import { INavState } from '../Navigation';
import { IEditorState, IUseEditorState } from './EditorBuilder';

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
			'it': 'Selezione Multipla',
			'en': 'Checkboxes',
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

export const QuestionStateMap = {
  normal:"normal",
  hover:"hover",
  edit:"edit",
  options:"options",
  layout:"layout"
}

const isEditState = (state:string) => {
	if (state === QuestionStateMap.edit) {
		return true;
	} else if (state === QuestionStateMap.options) {
		return true;
	} else if (state === QuestionStateMap.layout) {
		return true;
	}
	return false;
}

const createQuestionState = (nav:INavState) => {
	let qs = {}
	const questions = nav.getPage().items;
	for (let i = 0; i < questions.length; i++) {
		qs[questions[i].id] = QuestionStateMap.normal;
	}
	console.log('createQuestionState',qs);
	return qs;
}
const getInEditQuestion = (qs:any):[string,string] => {
	let keys = Object.keys(qs);
	for (let i = 0; i < keys.length; i++) {
		if (isEditState(qs[keys[i]])) {
			return [keys[i],qs[keys[i]]];
		}
	}
	return [null,null];
}

export interface PageEditorFormProps {
	editorState: IUseEditorState;
}

export function PageEditorForm({
	editorState,
	}: PageEditorFormProps) {
	const editor = editorState.editor;
	const nav = editorState.nav;
	const page = nav.getPage();
	const [anchorAddQuestion, setAnchorAddQuestion] = React.useState<null | HTMLElement>(null);
	const openAddQuestion = Boolean(anchorAddQuestion);
	const handleOpenAddQuestion = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorAddQuestion(event.currentTarget);
	};
	const handleAddQuestion = (type: string) => {
		setAnchorAddQuestion(null);
		if (typeof type !== 'undefined') {
			editor.addQuestion(type);
		}
	};
	// for handling hover / edit questions
	const [questionState, setQuestionState] = React.useState(createQuestionState(nav));
	const handleSetQuestionState = (id:string, state:string) => {
		if (id === null && state === null) {
			setQuestionState(createQuestionState(nav));
		}
		let curInEdit = getInEditQuestion(questionState);
		let qs = createQuestionState(nav);
		if (!Object.keys(qs).includes(curInEdit[0])) {
			curInEdit = [null,null];
		}
		if (!Object.keys(qs).includes(id)) {
			return
		}
		if (isEditState(state)) {
			if (curInEdit[0] !== null) {
				editor.cancelChanges();
			}
		} else {
			if (curInEdit[0] !== null) {
				qs[curInEdit[0]] = curInEdit[1];
			}
		}
		qs[id] = state;
		setQuestionState(qs);
		console.log('new questionState', qs);
	}
	// to update if changes the question numbers
	if (nav.getQuestions().length !== Object.keys(questionState).length) {
		handleSetQuestionState(null, null);
	}

	console.log('render page',page, questionState);
	return (
		<div style={{padding:'24px 0px'}}>
			{/* <Typography variant='h6'>Questions</Typography> */}
			<Stack spacing={2}>
			{page.items.map((question) => {
				console.log('before render qs', question.id, questionState, questionState[question.id]);
				if (page.layout.style === GroupMap.layout.style.card)  
				{
					return (
					<QuestionEditorForm
					key={question.id}
					editorState={editorState}
					question={question as Question}
					questionState={questionState[question.id]}
					handleSetQuestionState={handleSetQuestionState}
					/>
					);
				}
				return(
					<Paper>
						<QuestionEditorForm
							key={question.id}
							editorState={editorState}
							question={question as Question}
							questionState={questionState[question.id]}
							handleSetQuestionState={handleSetQuestionState}
						/>
					</Paper>
				);
			})}
			</Stack>
			<Button 
				color="inherit" 
				aria-controls={openAddQuestion ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={openAddQuestion ? 'true' : undefined}
				onClick={handleOpenAddQuestion}
			>
				<AddCircleIcon />
			</Button>
			<Menu
				anchorEl={anchorAddQuestion}
				open={openAddQuestion}
				onClose={(e) =>handleAddQuestion(undefined)}
			>
				{Object.keys(QuestionMenuTypesMap).map((key,idx) => {
					return (
						<MenuItem key={key} onClick={(e) =>handleAddQuestion(key)}>
							{QuestionMenuTypesMap[key].icon}
							<Typography>{QuestionMenuTypesMap[key].locale[editor.getRoot().options.locale]}</Typography>
						</MenuItem>
					);
				})}
			</Menu>
		</div>
	);
}