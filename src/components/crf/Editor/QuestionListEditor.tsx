import React from 'react';
import { TextField, FormLabel, Stack } from '@mui/material';
import { QuestionListCommon } from '../common';
import { QuestionCommonEditorForm, QuestionCommonEditorProps } from './CommonEditor';
import { QuestionList } from '../../../survey/src/lib/form/question-list';

export function QuestionListEditorForm({
  index,
  editorState,
  question,
  questionState,
  }: QuestionCommonEditorProps<QuestionList>) {
  const editor = editorState.editor;
  const nav = editorState.nav;

  const renderNormal = () => {
    return (
      <QuestionListCommon
      index={index}
      question={question}
      required={question.options.required}
      disabled={true}
      />
    );
  }
  const renderEdit = () => {
    return (
      <Stack spacing={1}>
      <div>
        <FormLabel component="legend">Source</FormLabel>
        <TextField
          value={question.options.source}
          onChange={(e) => {editor.onChangeValue(question.id,'options.source', e.target.value)}}
        />
      </div>
      <div>
        <FormLabel component="legend">Min</FormLabel>
        <TextField
          type={'number'}
          value={question.options.min}
          onChange={(e) => {editor.onChangeValue(question.id,'options.min', Number(e.target.value))}}
        />
      </div>
      <div>
        <FormLabel component="legend">Max</FormLabel>
        <TextField
          type={'number'}
          value={question.options.max}
          onChange={(e) => {editor.onChangeValue(question.id,'options.max', Number(e.target.value))}}
        />
      </div>
      </Stack>);
  }
  const renderLayout = () => {
    return null;
  }
  // console.log('render number', questionState);
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