import React from 'react';
import {GroupMap, Question} from '../../../core/schema'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button, Paper, Typography, MenuItem, Menu, Stack } from '@mui/material';
import { QuestionEditorForm } from './QuestionEditor';
import { INavState } from '../Navigation';
import { IUseEditorState } from './EditorBuilder';
import { QuestionMenuTypesMap } from '../../../core/schema/config-types';

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
	// console.log('createQuestionState',qs);
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
			const qs = editor.addQuestion(type);
			handleSetQuestionState(qs.id, QuestionStateMap.edit)
			console.log("add question", qs.id);
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
		// if (!Object.keys(qs).includes(id)) {
		// 	return
		// }
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
		// console.log('new questionState', qs);
	}
	// to update if changes the question numbers
	if (nav.getQuestions().length !== Object.keys(questionState).length) {
		handleSetQuestionState(null, null);
	}

	// console.log('render page',page, questionState);
	return (
		<div style={{padding:'24px 0px'}}>
			{/* <Typography variant='h6'>Questions</Typography> */}
			<Stack spacing={2}>
			{page.items.map((question) => {
				// console.log('before render qs', question.id, questionState, questionState[question.id]);
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