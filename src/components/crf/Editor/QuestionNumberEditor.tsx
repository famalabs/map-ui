import React from 'react';
import {QuestionNumberMap, toValidQuestionNumberMaxValue, toValidQuestionNumberMinValue, toValidQuestionNumberStep} from '../../forms'
import {QuestionNumber,Unit} from '../../../survey'
import { TextField, FormLabel, Stack, Typography, Slider, InputAdornment } from '@mui/material';
import { IUseEditorState } from './EditorBuilder';
import { renderSelectOption } from './OptionsEditor';
import { QuestionNumberCommon } from '../common';
import { QuestionCommonEditorForm, QuestionCommonEditorProps, QuestionGeneralEdit, renderGeneralOptions } from './CommonEditor';

export function QuestionNumberEditorForm({
  index,
  editorState,
  question,
  questionState,
  }: QuestionCommonEditorProps<QuestionNumber>) {
  const editor = editorState.editor;
  const nav = editorState.nav;
  const style = question.layout.style;

  const renderNormal = () => {
    return (
      <QuestionNumberCommon
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
      {renderSelectOption(QuestionNumberMap.options.unit, 'Unit', question.options.unit, editor, question.id, 'options.unit')}
      <div>
        <FormLabel component="legend">Min Value</FormLabel>
        <TextField
          type={'number'}
          value={question.options.min}
          onChange={(e) => {editor.onChangeValue(question.id,'options.min', Number(e.target.value))}}
        />
      </div>
      <div>
        <FormLabel component="legend">Max Value</FormLabel>
        <TextField
          type={'number'}
          value={question.options.max}
          onChange={(e) => {editor.onChangeValue(question.id,'options.max', Number(e.target.value))}}
        />
      </div>
      <div>
        <FormLabel component="legend">Step</FormLabel>
        <TextField
          type={'number'}
          value={question.options.step}
          onChange={(e) => {editor.onChangeValue(question.id,'options.step', Number(e.target.value))}}
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