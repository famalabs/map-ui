import React from 'react';
import {QuestionNumber, QuestionNumberMap} from '../../../core/schema'
import { TextField, FormLabel, Stack, Typography, Slider, FormControl, Select, MenuItem, InputAdornment } from '@mui/material';
import PinIcon from '@mui/icons-material/Pin';
import LinearScaleRoundedIcon from '@mui/icons-material/LinearScaleRounded';
import { IUseEditorState } from './EditorBuilder';
import { QuestionGeneralEdit, renderGeneralOptions } from './QuestionEditor';
import { QuestionStateMap } from './PageEditor';
import { renderSelectOption } from './OptionsEditor';

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

  const renderNormal = () => {
    return (
      <Stack spacing={1}>
        {question.layout.style === QuestionNumberMap.layout.style.range ? (
        <Stack spacing={1}>
          <FormLabel component="legend">{question.text}</FormLabel>
          <FormLabel component="legend">{question.description}</FormLabel>
          <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <Typography>{
            question.options.unit === QuestionNumberMap.options.unit.none ?
            '' : QuestionNumberMap.options.unit[question.options.unit]}</Typography>
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
            InputProps={{
              startAdornment: <InputAdornment position="start">{
                question.options.unit === QuestionNumberMap.options.unit.none ?
                '' : QuestionNumberMap.options.unit[question.options.unit]}</InputAdornment>,
            }}
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
    
    return (
    <div>
      {renderGeneralOptions(question,editorState)}
      <Stack spacing={1}>
      <Typography>Number Options</Typography>
      {renderSelectOption(QuestionNumberMap.options.unit, 'Unit', question.options.unit, editor, question.id, 'options.unit')}
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