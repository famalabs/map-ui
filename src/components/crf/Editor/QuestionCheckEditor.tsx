import React from 'react';
import {QuestionCheck} from '../../../survey'
import { QuestionStateMap } from './PageEditor';
import { QuestionCheckCommon } from '../common';
import { QuestionCommonEditorForm, QuestionCommonEditorProps, QuestionGeneralEdit, renderGeneralOptions } from './CommonEditor';

export function QuestionCheckEditorForm({
  index,
  editorState,
  question,
  questionState,
  }: QuestionCommonEditorProps<QuestionCheck>) {

  const editor = editorState.editor;
  const nav = editorState.nav;


  const renderNormal = () => {
    return (
      <QuestionCheckCommon
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
  // console.log('render text', questionState);
  return (
    <QuestionCommonEditorForm 
      contentNormal={renderNormal()} 
      contentEdit={renderEdit()} 
      contentLayout={renderLayout()} 
      index={index} 
      editorState={editorState} 
      question={question} 
      questionState={questionState}    
    />
  );
}