import React from 'react';
import {QuestionText} from '../../../survey'
import { IUseEditorState } from './EditorBuilder';
import { QuestionTextCommon } from '../common';
import { QuestionCommonEditorForm, QuestionCommonEditorProps, QuestionGeneralEdit, renderGeneralOptions } from './CommonEditor';

export function QuestionTextEditorForm({
  index,
  editorState,
  question,
  questionState,
  }: QuestionCommonEditorProps<QuestionText>) {

  const editor = editorState.editor;
  const nav = editorState.nav;

  const renderNormal = () => {
    return (
      <QuestionTextCommon
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