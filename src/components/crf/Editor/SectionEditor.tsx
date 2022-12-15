import React from 'react';
import {Question, QuestionMenuTypesMap, QuestionText, SurveyItem} from '../../../core/schema'
import { TextField, FormLabel, Stack, Typography, Button, Menu, MenuItem, Divider } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { QuestionTextMap } from '../../../core/schema';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { IUseEditorState } from './EditorBuilder';
import { QuestionEditorForm, QuestionGeneralEdit, renderGeneralOptions } from './QuestionEditor';
import { QuestionStateMap } from './PageEditor';

export interface SectionEditorFormProps {
  index?: any;
  editorState: IUseEditorState;
  section: SurveyItem;
  questionState: string;
  handleSetQuestionState: (id: string, state: string) => void;
}

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
      <Stack spacing={6}>
        <Stack spacing={1}
        onMouseEnter={() =>  {if (thisQuestionState === QuestionStateMap.normal){handleSetQuestionState(section.id, QuestionStateMap.hover)}}}
        onMouseLeave={() => {if (thisQuestionState === QuestionStateMap.hover) {handleSetQuestionState(section.id, QuestionStateMap.normal)}}}
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
				<AddCircleIcon />
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
                <Typography>{QuestionMenuTypesMap[key].locale[editor.getRoot().options.locale]}</Typography>
              </MenuItem>
            );
          }
				})}
			</Menu>
			</Stack>
    );
  }
  const renderHover = () => {
    return renderNormal();
  }
  const renderEdit = () => {
    return (
      <div>
        {QuestionGeneralEdit(section, editor)}
      </div>
    );
  }
  const renderLayout = () => {
    return null;
  }
  // console.log('render section', questionState);
  return (
    <div>
    {thisQuestionState === QuestionStateMap.normal ? (
      renderNormal()
    ) : thisQuestionState === QuestionStateMap.hover ? (
      renderHover()
    ) : thisQuestionState === QuestionStateMap.edit ? (
      renderEdit()
    ) : thisQuestionState === QuestionStateMap.options ? (
      // renderGeneralOptions(QuestionTextMap.options,"Text options")
      renderGeneralOptions(section, editorState)
    ) : thisQuestionState === QuestionStateMap.layout ? (
      renderLayout()
    ) : renderNormal()}
    </div>
  );
}