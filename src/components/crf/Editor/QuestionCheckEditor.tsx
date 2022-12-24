import React from 'react';
import { QuestionCheckMap} from '../../../core/schema'
import {QuestionCheck} from '../../../survey'
import { FormLabel, Stack, Switch, Checkbox, FormControlLabel } from '@mui/material';
import { IUseEditorState } from './EditorBuilder';
import { QuestionGeneralEdit, renderGeneralOptions } from './QuestionEditor';
import { QuestionStateMap } from './PageEditor';

export interface QuestionCheckEditorFormProps {
  index?: number;
  editorState: IUseEditorState;
  question: QuestionCheck;
  questionState: string;
}

export function QuestionCheckEditorForm({
  index,
  editorState,
  question,
  questionState,
  }: QuestionCheckEditorFormProps) {
  const editor = editorState.editor;
  const nav = editorState.nav;


  const renderNormal = () => {
    return (
      <Stack spacing={1}>
        <Stack spacing={1}>
          {/* <FormLabel component="legend">{question.text}</FormLabel> */}
          <FormLabel component="legend">{index && (index + '.')} {question.description}</FormLabel>
          {question.layout.style === QuestionCheckMap.layout.style.switch ? (
            <FormControlLabel disabled control={<Switch />} label={question.text} />
          ):(
            <FormControlLabel disabled control={<Checkbox />} label={question.text} />
          )}
        </Stack>
      </Stack>
    );
  }
  const renderHover = () => {
    return renderNormal();
  }
  const renderEdit = () => {
    return (
      <div>
        {QuestionGeneralEdit(question, editor)}
      </div>
    );
  }
  const renderLayout = () => {
    return null;
  }
  // console.log('render text', questionState);
  return (
    <div>
    {questionState === QuestionStateMap.normal ? (
      renderNormal()
    ) : questionState === QuestionStateMap.hover ? (
      renderHover()
    ) : questionState === QuestionStateMap.edit ? (
      renderEdit()
    ) : questionState === QuestionStateMap.options ? (
      // renderGeneralOptions(QuestionTextMap.options,"Text options")
      renderGeneralOptions(question, editorState)
    ) : questionState === QuestionStateMap.layout ? (
      renderLayout()
    ) : renderNormal()}
    </div>
  );
}