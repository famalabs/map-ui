import React from 'react';
import {QuestionDate} from '../../../survey'
import { FormLabel, TextField, Typography } from '@mui/material';
import { IUseEditorState } from './EditorBuilder';
import { DatePicker } from '@mui/x-date-pickers';
import { QuestionDateCommon } from '../common';
import { QuestionCommonEditorForm, QuestionCommonEditorProps, QuestionGeneralEdit, renderGeneralOptions } from './CommonEditor';

export function QuestionDateEditorForm({
  index,
  editorState,
  question,
  questionState,
  }: QuestionCommonEditorProps<QuestionDate>) {

  const editor = editorState.editor;
  const nav = editorState.nav;

  const renderNormal = () => {
    return (
      <QuestionDateCommon
      index={index}
      question={question}
      required={question.options.required}
      disabled={true}
      />
    );
  }
  const renderEdit = () => {
    return null;
  }
  const renderLayout = () => {
    return null;
  }
  // console.log('render Date', questionState);
  return (
    <QuestionCommonEditorForm 
      contentNormal={renderNormal()} 
      contentEdit={renderEdit()} 
      contentLayout={undefined} 
      index={index} 
      editorState={editorState} 
      question={question} 
      questionState={questionState}    
    />
  );
}