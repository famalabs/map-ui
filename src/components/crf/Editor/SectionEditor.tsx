import React from 'react';
import {QuestionMenuTypesMap} from '../../../core/schema'
import {Item} from '../../../survey'
import { Stack, Typography, Button, Menu, MenuItem, Divider } from '@mui/material';
import {AddCircle} from '@mui/icons-material';
import { IUseEditorState } from './EditorBuilder';
import { QuestionEditorForm } from './QuestionEditor';
import { QuestionStateMap } from './PageEditor';
import { QuestionCommonEditorForm, QuestionGeneralEdit, renderGeneralOptions } from './CommonEditor';

export interface SectionEditorFormProps {
  index?: any;
  editorState: IUseEditorState;
  section: Item;
  questionState: string;
  handleSetQuestionState: (id: string, state: string) => void;
}

const locale = "en";

export function SectionEditorForm({
  index,
  editorState,
  section,
  questionState,
  handleSetQuestionState,
  }: SectionEditorFormProps) {

  const thisQuestionState = questionState[section.id];
  const editor = editorState.editor;
  const nav = editorState.nav;

  const [anchorAddQuestion, setAnchorAddQuestion] = React.useState<null | HTMLElement>(null);
	const openAddQuestion = Boolean(anchorAddQuestion);
	const handleOpenAddQuestion = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorAddQuestion(event.currentTarget);
	};
	const handleAddQuestion = (type: string) => {
		setAnchorAddQuestion(null);
		if (typeof type !== 'undefined') {
			const qs = editor.addQuestion(type, section.id);
      console.log('handle',type, qs);
			handleSetQuestionState(qs.id, QuestionStateMap.edit);
		}
	};

  const renderNormal = () => {
    return (
      <Stack spacing={2}>
        <Stack spacing={1}
        onMouseEnter={() =>  {if (thisQuestionState === QuestionStateMap.normal){handleSetQuestionState(section.id, QuestionStateMap.hover)}}}
        // onMouseLeave={() => {if (thisQuestionState === QuestionStateMap.hover) {handleSetQuestionState(section.id, QuestionStateMap.normal)}}}
        onClick={(e) => {if (thisQuestionState === QuestionStateMap.hover) {handleSetQuestionState(section.id, QuestionStateMap.edit)}}}
        >
        <Typography variant='h4'>{section.text}</Typography>
        <Typography>{section.description}</Typography>
        </Stack>
			{section.items.map((question, idx) => {
				return(
          <QuestionEditorForm
					key={question.id}
					index={index[question.id]}
					editorState={editorState}
					question={question}
					questionState={questionState[question.id]}
					handleSetQuestionState={handleSetQuestionState}
					/>
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
          if (key !== QuestionMenuTypesMap.section.type) {
            return (
              <MenuItem key={key} onClick={(e) =>handleAddQuestion(key)}>
                {QuestionMenuTypesMap[key].icon}
                <Typography>{QuestionMenuTypesMap[key].locale[locale]}</Typography>
              </MenuItem>
            );
          }
				})}
			</Menu>
      <Divider variant='middle'/>
			</Stack>
    );
  }
  const renderEdit = () => {
    return null;
  }
  const renderLayout = () => {
    return null;
  }
  // console.log('render section', questionState);
  return (
    <QuestionCommonEditorForm 
      contentNormal={renderNormal()} 
      contentEdit={renderEdit()} 
      contentLayout={renderLayout()} 
      index={index} 
      editorState={editorState} 
      question={section} 
      questionState={questionState}    
    />
  );
}