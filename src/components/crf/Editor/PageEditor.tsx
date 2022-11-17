import React from 'react';
import {Survey, GroupMap, Question, QuestionMap, QuestionTextMap, QuestionNumberMap, QuestionSelectMap, QuestionCheckMap, QuestionDateMap, FnMap} from '../../../core/schema'
import { AutoSelect } from '../../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid, Typography, InputLabel, Select, MenuItem, FormLabel, Accordion, AccordionSummary, AccordionDetails, Menu, Stack, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TextFieldsIcon from '@mui/icons-material/TextFields';
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
				// id="basic-menu"
				anchorEl={anchorAddQuestion}
				open={openAddQuestion}
				onClose={(e) =>handleAddQuestion(undefined)}
				// MenuListProps={{
				// 'aria-labelledby': 'basic-button',
				// }}
			>
				{/* <Stack direction="row"></Stack> */}
				<Divider variant='middle'>Questions</Divider>
				<MenuItem onClick={(e) =>handleAddQuestion(QuestionTextMap.type)}><TextFieldsIcon/> <Typography>Text</Typography></MenuItem>
				<MenuItem onClick={(e) =>handleAddQuestion(QuestionTextMap.layout.style.area)}><TextFieldsIcon/> <Typography>Text Multiline</Typography></MenuItem>
				<MenuItem onClick={(e) =>handleAddQuestion(QuestionNumberMap.type)}><PinIcon/> <Typography>Number</Typography></MenuItem>
				<MenuItem onClick={(e) =>handleAddQuestion(QuestionNumberMap.layout.style.range)}><LinearScaleRoundedIcon/> <Typography>Slider</Typography></MenuItem>
				<MenuItem onClick={(e) =>handleAddQuestion(QuestionSelectMap.type)}><RadioButtonCheckedIcon/> <Typography>Radio Buttons</Typography></MenuItem>
				<MenuItem onClick={(e) =>handleAddQuestion(QuestionSelectMap.layout.style.dropdown)}><ArrowDropDownCircleOutlinedIcon/> <Typography>Dropdown</Typography></MenuItem>
				<MenuItem onClick={(e) =>handleAddQuestion(QuestionSelectMap.type+GroupMap.layout.style.table)}><TocRoundedIcon/> <Typography>Table Radio Buttons</Typography></MenuItem>
				<MenuItem onClick={(e) =>handleAddQuestion(QuestionCheckMap.type)}><CheckBoxIcon/> <Typography>Checkboxses</Typography></MenuItem>
				<MenuItem onClick={(e) =>handleAddQuestion(QuestionDateMap.type)}><CalendarMonthIcon/><Typography>Date</Typography></MenuItem>
				<Divider variant='middle'>Functions</Divider>
				<MenuItem onClick={(e) =>handleAddQuestion(FnMap.type)}><CalendarMonthIcon/><Typography>Function</Typography></MenuItem>
				{/* <Divider variant='middle' >Layout</Divider>
				<MenuItem onClick={(e) =>handleAddQuestion(undefined)}><CalendarMonthIcon/><Typography>Group</Typography></MenuItem> */}
			</Menu>
		</div>
	);
}