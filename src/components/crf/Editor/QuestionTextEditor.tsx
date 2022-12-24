import React from 'react';
import {QuestionText} from '../../../survey'
import { TextField, FormLabel, Stack, Typography } from '@mui/material';
import { QuestionTextMap } from '../../../core/schema';
import { IUseEditorState } from './EditorBuilder';
import { QuestionGeneralEdit, renderGeneralOptions } from './QuestionEditor';
import { QuestionStateMap } from './PageEditor';

export interface QuestionTextEditorFormProps {
  index?: number;
  editorState: IUseEditorState;
  question: QuestionText;
  questionState: string;
}

export function QuestionTextEditorForm({
  index,
  editorState,
  question,
  questionState,
  }: QuestionTextEditorFormProps) {
  const editor = editorState.editor;
  const nav = editorState.nav;

  const renderNormal = () => {
    return (
      <Stack spacing={1}>
        <Stack spacing={1}>
          <FormLabel component="legend">          
          <Typography>{index && (index + '.')} {question.text}{question.options.required && '*'}</Typography>
         </FormLabel>
          <FormLabel component="legend">{question.description}</FormLabel>
          {question.layout.style === QuestionTextMap.layout.style.area ? (
            <TextField
              disabled
              // value={question.description ?? question.text}
              // label={question.description ?? question.text}
              required={question.options.required}
            />
          ):(
            <TextField
            disabled
            multiline
            // value={question.description ?? question.text}
            // label={question.description ?? question.text}
            required={question.options.required}
          />
          )}
        </Stack>
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
  const renderLayout = () => {
    return null;
  }
  // console.log('render text', questionState);
  return (
    <div>
    {questionState === QuestionStateMap.normal ? (
      renderNormal()
    ) : questionState === QuestionStateMap.hover ? (
      renderHover()
    ) : questionState === QuestionStateMap.edit ? (
      renderEdit()
    ) : questionState === QuestionStateMap.options ? (
      // renderGeneralOptions(QuestionTextMap.options,"Text options")
      renderGeneralOptions(question, editorState)
    ) : questionState === QuestionStateMap.layout ? (
      renderLayout()
    ) : renderNormal()}
    </div>
  );
}