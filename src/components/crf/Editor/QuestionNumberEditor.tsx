import React from 'react';
import {QuestionNumberMap, toValidQuestionNumberMaxValue, toValidQuestionNumberMinValue, toValidQuestionNumberStep} from '../../../core/schema'
import {QuestionNumber,Unit} from '../../../survey'
import { TextField, FormLabel, Stack, Typography, Slider, InputAdornment } from '@mui/material';
import { IUseEditorState } from './EditorBuilder';
import { QuestionStateMap } from './PageEditor';
import { renderSelectOption } from './OptionsEditor';
import { QuestionNumberCommon } from '../common';
import { QuestionCommonEditorProps, QuestionGeneralEdit, renderGeneralOptions } from './CommonEditor';

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
  const renderNumberOptions = () => {
    
    return (
    <div>
      {renderGeneralOptions(question,editorState)}
      <Stack spacing={1}>
      <Typography>Number Options</Typography>
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
      </Stack>
    </div>);
  }
  const renderLayout = () => {
    return null;
  }
  // console.log('render number', questionState);
  return (
    <div>
    {questionState === QuestionStateMap.normal ? (
      renderNormal()
    ) : questionState === QuestionStateMap.hover ? (
      renderHover()
    ) : questionState === QuestionStateMap.edit ? (
      renderEdit()
    ) : questionState === QuestionStateMap.options ? (
      // renderGeneralOptions(QuestionNumberMap.options,"Number options")
      // renderGeneralOptions(undefined,undefined)
      renderNumberOptions()
    ) : questionState === QuestionStateMap.layout ? (
      renderLayout()
    ) : renderNormal()}
    </div>
  );
}