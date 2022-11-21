import React from 'react';
import {QuestionNumber, QuestionNumberMap} from '../../../core/schema'
import { TextField, FormLabel, Stack, Typography, Slider } from '@mui/material';
import PinIcon from '@mui/icons-material/Pin';
import LinearScaleRoundedIcon from '@mui/icons-material/LinearScaleRounded';
import { IUseEditorState } from './EditorBuilder';
import { QuestionGeneralEdit, renderGeneralOptions } from './QuestionEditor';
import { QuestionStateMap } from './PageEditor';

export interface QuestionNumberEditorFormProps {
  editorState: IUseEditorState;
  question: QuestionNumber;
  questionState: string;
}

export function QuestionNumberEditorForm({
  editorState,
  question,
  questionState,
  }: QuestionNumberEditorFormProps) {
  const editor = editorState.editor;
  const nav = editorState.nav;
  const style = question.layout.style;

  const renderIcon = () => {
    return (question.layout.style === QuestionNumberMap.layout.style.range 
      ? (<LinearScaleRoundedIcon/>):(<PinIcon/>));
  }

  const renderNormal = () => {
    return (
      <Stack spacing={1}>
        {question.layout.style === QuestionNumberMap.layout.style.range ? (
        <Stack spacing={1}>
          <FormLabel component="legend">{question.text}</FormLabel>
          <FormLabel component="legend">{question.description}</FormLabel>
          <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <Typography>{question.options.minValue}</Typography>
            <Slider 
            disabled
            step={question.options.step}
            marks
            min={question.options.minValue}
            max={question.options.maxValue}
             />
            <Typography>{question.options.maxValue}</Typography>
          </Stack>
        </Stack>
        ):(
          <Stack spacing={1}>
          <FormLabel component="legend">{question.text}</FormLabel>
          <FormLabel component="legend">{question.description}</FormLabel>
          <TextField
            disabled
            // value={question.description ?? question.text}
            // label={question.description ?? question.text}
            required={question.options.required}
          />
        </Stack>
        )}
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
  const renderNumberOptions = () => {
    const editor = editorState.editor;
    const nav = editorState.nav;
    return (
    <div>
      {renderGeneralOptions(question,editorState)}
      <Stack spacing={1}>
      <Typography>Number Options</Typography>
      <div>
        <FormLabel component="legend">minValue</FormLabel>
        <TextField
          type={'number'}
          value={question.options.minValue}
          onChange={(e) => {editor.onChangeValue(question.id,'options.minValue', e.target.value)}}
        />
      </div>
      <div>
        <FormLabel component="legend">maxValue</FormLabel>
        <TextField
          type={'number'}
          value={question.options.maxValue}
          onChange={(e) => {editor.onChangeValue(question.id,'options.maxValue', e.target.value)}}
        />
      </div>
      <div>
        <FormLabel component="legend">step</FormLabel>
        <TextField
          type={'number'}
          value={question.options.step}
          onChange={(e) => {editor.onChangeValue(question.id,'options.step', e.target.value)}}
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