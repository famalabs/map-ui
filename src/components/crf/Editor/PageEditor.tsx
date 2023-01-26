import React from 'react';
import {GroupMap} from '../../../core/schema';
import {Item} from '../../../survey';
import {AddCircle} from '@mui/icons-material';
import { Button, Paper, Typography, MenuItem, Menu, Stack } from '@mui/material';
import { QuestionEditorForm } from './QuestionEditor';
import { INavState } from '../Navigation';
import { IUseEditorState } from './EditorBuilder';
import { getQuestionMenuType, QuestionMenuTypesMap } from '../../../core/schema/config-types';

export const QuestionStateMap = {
  normal:"normal",
  hover:"hover",
  edit:"edit",
  options:"options",
  layout:"layout"
}

const locale = "it";

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

	const recCreateQS = (items:Item[], qs:any) => {
		for (let i = 0; i < items.length; i++) {
			if ([QuestionMenuTypesMap.section.type,QuestionMenuTypesMap.cond.type]
				.includes(getQuestionMenuType(items[i]))) {
				// qs[items[i].id] = {
				// 	state: itemstateMap.normal,
				// };
				qs[items[i].id] = QuestionStateMap.normal;
				qs = recCreateQS(items[i].items, qs);
			} else {
				qs[items[i].id] = QuestionStateMap.normal;
			}
		}
		return qs;
	}

	let qs = {}
	qs['folder'] = nav.getFolderId();
	qs['page'] = nav.getPageId();
	qs = recCreateQS(nav.getPage().items, qs);
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
	const orders = nav.getItemsGlobalOrderIndex()[nav.getFolderId()][page.id];
	const [anchorAddQuestion, setAnchorAddQuestion] = React.useState<null | HTMLElement>(null);
	const openAddQuestion = Boolean(anchorAddQuestion);
	const handleOpenAddQuestion = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorAddQuestion(event.currentTarget);
	};
	const handleAddQuestion = (type: string) => {
		setAnchorAddQuestion(null);
		if (typeof type !== 'undefined') {
			const qs = editor.addQuestion(type);
			handleSetQuestionState(qs.id, QuestionStateMap.edit);
		}
	};
	// for handling hover / edit questions
	const [questionState, setQuestionState] = React.useState(createQuestionState(nav));
	const handleSetQuestionState = (id:string, state:string) => {
		if (id === null && state === null) {
			setQuestionState(createQuestionState(nav));
			return;
		}
		if (!Object.keys(questionState).includes(id)) {
			let qs = createQuestionState(nav);
			qs[id] = state;
			setQuestionState(qs);
			return;
		}
		let curInEdit = getInEditQuestion(questionState); // (id,state)
		let qs = createQuestionState(nav); // empty qs
		// cur in edit not in items
		if (!Object.keys(qs).includes(curInEdit[0])) {
			curInEdit = [null,null];
		}
		// if next state is edit
		if (isEditState(state)) {
			// has cur in edit
			if (curInEdit[0] !== null) {
				// cur in edit is next
				if (curInEdit[0] === id) {

				} else {
					editor.cancelChanges();
					// return;
				}
			}
		} 
		// if next state not is edit
		else {
			// if cur in edit
			if (curInEdit[0] !== null) {
				qs[curInEdit[0]] = curInEdit[1];
			}
		}
		qs[id] = state;
		console.log('set new questionState', qs);
		setQuestionState(qs);
	}
	// to update if changes the page or folder numbers
	if (nav.getPageId() !== questionState['page'] || nav.getFolderId() !== questionState['folder']) {
		handleSetQuestionState(null, null);

	}

	console.log('render page questionState',page, questionState);
	return (
		<div style={{padding:'12px 0px'}}>
			{/* <Typography variant='h6'>Questions</Typography> */}
			<Stack spacing={2}>
			{page.items.map((question, index) => {
				// console.log('before render qs', question.id, questionState, questionState[question.id]);
				// const realQuestionState = [QuestionMenuTypesMap.section.type,QuestionMenuTypesMap.cond.type].includes(getQuestionMenuType(question))
				// ? questionState : questionState[question.id] ?? QuestionStateMap.normal;
				
				if (page.layout.style === GroupMap.layout.style.card)  
				{
					return (
					<QuestionEditorForm
					key={question.id}
					index={orders[question.id]}
					editorState={editorState}
					question={question}
					questionState={questionState}
					handleSetQuestionState={handleSetQuestionState}
					/>
					);
				}
				return(
					<Paper>
						<QuestionEditorForm
							key={question.id}
							index={orders[question.id]}
							editorState={editorState}
							question={question}
							questionState={questionState}
							handleSetQuestionState={handleSetQuestionState}
						/>
					</Paper>
				);
			})}
			<Button 
				color="inherit" 
				aria-controls={openAddQuestion ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={openAddQuestion ? 'true' : undefined}
				onClick={handleOpenAddQuestion}
			>
				<AddCircle />
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
							<Typography>{QuestionMenuTypesMap[key].locale[locale]}</Typography>
						</MenuItem>
					);
				})}
			</Menu>
			</Stack>
		</div>
	);
}