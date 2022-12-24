import React from 'react';
import {QuestionNumberMap, toValidQuestionNumberMaxValue, toValidQuestionNumberMinValue, toValidQuestionNumberStep} from '../../../core/schema'
import {QuestionNumber,Unit} from '../../../survey'
import { TextField, FormLabel, Stack, Typography, Slider, InputAdornment } from '@mui/material';
import { IUseEditorState } from './EditorBuilder';
import { QuestionGeneralEdit, renderGeneralOptions } from './QuestionEditor';
import { QuestionStateMap } from './PageEditor';
import { renderSelectOption } from './OptionsEditor';

export interface QuestionNumberEditorFormProps {
  index?: number;
  editorState: IUseEditorState;
  question: QuestionNumber;
  questionState: string;
}

export function QuestionNumberEditorForm({
  index,
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
          <FormLabel component="legend">
          <Typography>{index && (index + '.')} {question.text}{question.options.required && '*'}</Typography>
          </FormLabel>
          <FormLabel component="legend">{question.description}</FormLabel>
          <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            {/* <Typography>{
            question.options.unit === undefined ?
            '' : QuestionNumberMap.options.unit[question.options.unit]}</Typography> */}
            <Typography>{`Unit: ${question.options.unit}`}</Typography>
            <Typography>{`Min: ${question.options.min}`}</Typography>
            <Slider 
            disabled
            step={toValidQuestionNumberStep(question.options.step)}
            marks
            min={toValidQuestionNumberMinValue(question.options.min)}
            max={toValidQuestionNumberMaxValue(question.options.max)}
             />
            <Typography>{`Max: ${question.options.max}`}</Typography>
            <Typography>{`Step: ${question.options.step}`}</Typography>
          </Stack>
        </Stack>
        ):(
          <Stack spacing={1}>
          <FormLabel component="legend">
          <Typography>{index && (index + '.')} {question.text}{question.options.required && '*'}</Typography>  
          </FormLabel>
          <FormLabel component="legend">{question.description}</FormLabel>
          <TextField
            disabled
            // value={question.description ?? question.text}
            label={
              `( Min: ${question.options.min}
                , Max: ${question.options.max}
                , Step: ${question.options.step} )`}
            required={question.options.required}
            InputProps={{
              startAdornment: <InputAdornment position="start">{`Unit: ${question.options.unit}`}</InputAdornment>,
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