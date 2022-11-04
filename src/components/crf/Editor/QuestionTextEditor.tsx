import React from 'react';
import {QuestionText} from '../../../core/schema'
import { TextField, FormLabel, Stack } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { QuestionTextMap } from '../../../core/schema';
import { IUseEditorState } from './EditorBuilder';
import { QuestionGeneralEdit, QuestionStateMap, renderGeneralOptions } from './QuestionEditor';

export interface QuestionTextEditorFormProps {
  editorState: IUseEditorState;
  question: QuestionText;
  questionState: string;
}

export function QuestionTextEditorForm({
  editorState,
  question,
  questionState,
  }: QuestionTextEditorFormProps) {
  const editor = editorState.editor;
  const nav = editorState.nav;

  const renderIcon = () => {
    return (<TextFieldsIcon/>);
  }

  const renderNormal = () => {
    return (
      <Stack spacing={1}>
        <Stack spacing={1}>
          <FormLabel component="legend">{question.text}</FormLabel>
          {question.layout.style === QuestionTextMap.layout.style.area ? (
            <TextField
              disabled
              value={question.description ?? question.text}
              label={question.description ?? question.text}
              required={question.options.required}
            />
          ):(
            <TextField
            disabled
            multiline
            value={question.description ?? question.text}
            label={question.description ?? question.text}
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
  console.log('render text', questionState);
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
    ) : null}
    </div>
  );
}