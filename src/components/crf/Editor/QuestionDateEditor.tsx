import React from 'react';
import {QuestionDate, QuestionDateMap} from '../../../core/schema'
import { TextField, FormLabel } from '@mui/material';
import PinIcon from '@mui/icons-material/Pin';
import { IUseEditorState } from './EditorBuilder';
import { QuestionGeneralEdit, renderGeneralOptions } from './QuestionEditor';
import { QuestionStateMap } from './PageEditor';

export interface QuestionDateEditorFormProps {
  editorState: IUseEditorState;
  question: QuestionDate;
  questionState: string;
}

export function QuestionDateEditorForm({
  editorState,
  question,
  questionState,
  }: QuestionDateEditorFormProps) {
  const editor = editorState.editor;
  const nav = editorState.nav;

  const renderIcon = () => {
    return (<PinIcon/>);
  }

  const renderNormal = () => {
    return (
      <div>
        <div>
          <FormLabel component="legend">{question.text}</FormLabel>
          <FormLabel component="legend">{question.description}</FormLabel>
          <TextField
            disabled
            // value={question.description ?? question.text}
            // label={question.description ?? question.text}
            required={question.options.required}
          />
        </div>
      </div>
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
  console.log('render Date', questionState);
  return (
    <div>
    {questionState === QuestionStateMap.normal ? (
      renderNormal()
    ) : questionState === QuestionStateMap.hover ? (
      renderHover()
    ) : questionState === QuestionStateMap.edit ? (
      renderEdit()
    ) : questionState === QuestionStateMap.options ? (
      // renderGeneralOptions(QuestionDateMap.options,"Date options")
      renderGeneralOptions(question, editorState)
    ) : questionState === QuestionStateMap.layout ? (
      renderLayout()
    ) : renderNormal()}
    </div>
  );
}